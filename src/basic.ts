import { z, type ZodObject, type input, type output } from "zod";

export class ConfigError extends Error { }

export type ConfigDefinition<
  PackageName extends string,
  ConfigSchema extends ZodObject,
  SubSchemas extends Record<string, ZodObject>,
> = {
  package: PackageName,
  schema: ConfigSchema,
  dependencies: {[packageName in keyof SubSchemas & string]: ConfigDefinition<packageName, SubSchemas[packageName], any>},
  // will be set later
  input: ConfigInput<PackageName, ConfigSchema, SubSchemas>,
  output: output<ConfigSchema>,  // wrapped in proxy
  // status:
  isLoaded: boolean,
  loaded: Promise<void>,
  _resolve: (value: void) => void,
  _reject: (error: Error) => void,
}

export type AnyConfigDefinition = ConfigDefinition<string, any, any>;

function wrapInProxy<T extends object>(data: T, definition: { isLoaded: boolean }) {
  return new Proxy(data, {
    get(target, prop, receiver) {
      if (!definition.isLoaded) {
        throw new Error("Tried to access config but it is not set yet. Did you forget to set or load the config?");
      }
      return (target as any)[prop];
    }
  }) as T;
}

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

type ToSubDefinitionObject<SubDefinitionArray extends AnyConfigDefinition[]> = (
  {
    // first the direct subdefinitions
    [SubDefinition in SubDefinitionArray[number] as SubDefinition['package']]: (
      SubDefinition extends { schema: infer SubSchema } ? SubSchema : never
    )
  } & {
    // also the subconfigs of the subconfigs
    [SubSubPkg in keyof UnionToIntersection<SubDefinitionArray[number]['dependencies']>]: (
      // @ts-ignore (should be ok)
      UnionToIntersection<SubDefinitionArray[number]['dependencies']>[SubSubPkg]['schema']
    )
});

type ResultConfigDefinition<
  PackageName extends string,
  ConfigSchema extends ZodObject,
  SubDefinitionArray extends AnyConfigDefinition[]
> = ConfigDefinition<PackageName, ConfigSchema, ToSubDefinitionObject<SubDefinitionArray>>;

export function defineConfig<
  PackageName extends string,
  ConfigSchema extends ZodObject,
  SubDefinitionArray extends AnyConfigDefinition[],
  const Extra extends object = {}
>(args: {
  package: PackageName,
  schema: ConfigSchema,
  dependencies: SubDefinitionArray,
} & Extra): ResultConfigDefinition<PackageName, ConfigSchema, SubDefinitionArray> & Omit<Extra, keyof AnyConfigDefinition> {

  let _resolve!: (value: void) => void;
  let _reject!: (error: Error) => void;
  const loaded = new Promise<void>((resolve, reject) => {
    _resolve = resolve;
    _reject = reject;
  })

  const subDefinitionRegistry = {} as any;

  const registerConfig = (definition: AnyConfigDefinition) => {
    const subPkg = definition.package;
    const prevRegisteredDefinition = subDefinitionRegistry[subPkg];
    if (prevRegisteredDefinition === undefined) {
      subDefinitionRegistry[subPkg] = definition;
    } else if (prevRegisteredDefinition !== definition) {
      throw new ConfigError(`Package name '${subPkg}' is used for two different config definitions`);
    }
  }

  for (const subConfig of args.dependencies) {
    registerConfig(subConfig);
    for (const subSubDefinition of Object.values(subConfig.dependencies)) {
      registerConfig(subSubDefinition);
    }
  }

  const definition = {
    ...args,
    package: args.package,
    schema: args.schema,
    dependencies: subDefinitionRegistry as any,
    // will be set later
    input: {} as any,
    output: {} as any,
    // promise-related:
    isLoaded: false,
    loaded,
    _resolve,
    _reject,
  };
  
  definition.output = wrapInProxy(definition.output, definition);

  return definition;
}


type ConfigInput<
  PackageName extends string,
  ConfigSchema extends ZodObject,
  SubSchemas extends Record<string, ZodObject>,
> = (
  Record<PackageName, input<ConfigSchema>>
  & { [subPackageName in keyof SubSchemas]: input<SubSchemas[subPackageName]> }
);

// helper type for unified profiles
export type MergeConfigTypes<ConfigDefs extends AnyConfigDefinition[]> = {
  [key in keyof ToSubDefinitionObject<ConfigDefs>]: input<ToSubDefinitionObject<ConfigDefs>[key]>
};

function setSingleConfig(definition: AnyConfigDefinition, allData: any, allowOverride: boolean) {
  if (!(definition.package in allData)) {
    throw new Error(`Expected config for package "${definition.package}"`);
  }

  // allow setting the same config twice
  if (definition.isLoaded && definition.input === allData[definition.package]) {
    return;
  }

  if (definition.isLoaded) {
    if (allowOverride) {
      console.warn(`WARNING: Overriding config for "${definition.package}"!`);
    } else {
      throw new ConfigError(`Can't override config "${definition.package}" as it is already set`);
    }
  }

  definition.input = allData[definition.package];
  const subData = definition.schema.parse(allData[definition.package]);
  Object.assign(definition.output, subData);
  if (!definition.isLoaded) {
    definition.isLoaded = true;
    definition._resolve();
  }
}

export async function setConfig<
  PackageName extends string,
  ConfigSchema extends ZodObject,
  SubSchemas extends Record<string, ZodObject>,
>(
  definition: ConfigDefinition<PackageName, ConfigSchema, SubSchemas>,
  inputData: ConfigInput<PackageName, ConfigSchema, SubSchemas>,
  opts?: { forceOverride: boolean }
) {
  const override = opts?.forceOverride ?? false;
  setSingleConfig(definition, inputData, override);

  for (const subDefinition of Object.values(definition.dependencies)) {
    setSingleConfig(subDefinition, inputData, override);
  }
}

export async function getConfig<
  PackageName extends string,
  ConfigSchema extends ZodObject,
  SubSchemas extends Record<string, ZodObject>,
>(
  definition: ConfigDefinition<PackageName, ConfigSchema, SubSchemas>,
): Promise<output<ConfigSchema>> {
  await definition.loaded;
  return definition.output;
}
