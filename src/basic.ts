import { z, type ZodObject, type input, type output } from "zod";

export class ConfigError extends Error { }

export type ConfigMeta<
  PackageName extends string,
  ConfigSchema extends ZodObject,
  SubSchemas extends Record<string, ZodObject>,
> = {
  package: PackageName,
  schema: ConfigSchema,
  subConfigs: {[packageName in keyof SubSchemas & string]: Config<ConfigMeta<packageName, SubSchemas[packageName], any>, SubSchemas[packageName]>},
  isLoaded: boolean,
  loaded: Promise<void>,
  _resolve: (value: void) => void,
  _reject: (error: Error) => void,
}

export type Config<
  Meta,
  ConfigSchema extends ZodObject,
> = (
  { _meta: Meta } & output<ConfigSchema>
);

export type AnyConfig = Config<ConfigMeta<string, any, any>, any>;

function wrapInProxy<T extends object & { _meta: { isLoaded: boolean } }>(obj: T) {
  return new Proxy(obj, {
    get(target, prop, receiver) {
      if (prop === '_meta') {
        return target._meta;
      }
      if (!target._meta.isLoaded) {
        throw new Error("Tried to access config but it is not set yet. Did you forget to set or load the config?");
      }
      return (target as any)[prop];
    }
  }) as T;
}

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

type ResultConfigMeta<
  PackageName extends string,
  ConfigSchema extends ZodObject,
  SubConfigsArray extends Config<ConfigMeta<string, any, any>, any>[]
> = ConfigMeta<PackageName, ConfigSchema, (
  {
    // first the configured subconfigs
    [SubConfig in SubConfigsArray[number] as SubConfig['_meta']['package']]: (
      SubConfig extends { _meta: { schema: infer SubSchema }} ? SubSchema : never
    )
  } & {
    // also the subconfigs of the subconfigs
    [SubSubPkg in keyof UnionToIntersection<SubConfigsArray[number]['_meta']['subConfigs']>]: (
      // @ts-ignore (should be ok)
      UnionToIntersection<SubConfigsArray[number]['_meta']['subConfigs']>[SubSubPkg]['_meta']['schema']
    )
})>;

export function makeConfig<
  const PackageName extends string,
  const ConfigSchema extends ZodObject,
  const SubConfigsArray extends Config<ConfigMeta<string, any, any>, any>[],
  const Extra extends object = {}
>(args: {
  package: PackageName,
  schema: ConfigSchema,
  subConfigs: SubConfigsArray,
} & Extra): Config<ResultConfigMeta<PackageName, ConfigSchema, SubConfigsArray> & Omit<Extra, 'package' | 'schema' | 'subConfigs'>, ConfigSchema> {

  let _resolve!: (value: void) => void;
  let _reject!: (error: Error) => void;
  const loaded = new Promise<void>((resolve, reject) => {
    _resolve = resolve;
    _reject = reject;
  })

  const subConfigObject = {} as any;

  const registerConfig = (subConfig: Config<ConfigMeta<string, any, any>, any>) => {
    const subPkg = subConfig._meta.package;
    const prevRegisteredConfig = subConfigObject[subPkg];
    if (prevRegisteredConfig === undefined) {
      subConfigObject[subPkg] = subConfig;
    } else if (prevRegisteredConfig !== subConfig) {
      throw new ConfigError(`Package name '${subPkg}' is used for two different configs`);
    }
  }

  for (const subConfig of args.subConfigs) {
    registerConfig(subConfig);
    for (const subSubConfig of Object.values(subConfig._meta.subConfigs)) {
      registerConfig(subSubConfig);
    }
  }

  const _meta: ResultConfigMeta<PackageName, ConfigSchema, SubConfigsArray> = {
    package: args.package,
    schema: args.schema,
    subConfigs: subConfigObject as any,
    isLoaded: false,
    loaded,
    _resolve,
    _reject,
  };
  
  // @ts-expect-error for simplicity, the types assume that config is always defined.
  return wrapInProxy({ _meta });
}


export type ConfigData<
  PackageName extends string,
  ConfigSchema extends ZodObject,
  SubSchemas extends Record<string, ZodObject>,
> = (
  Record<PackageName, input<ConfigSchema>>
  & { [subPackageName in keyof SubSchemas]: input<SubSchemas[subPackageName]> }
);

function setSingleConfig(config: AnyConfig, allData: any, allowOverride: boolean) {
  if (!(config._meta.package in allData)) {
    throw new Error(`Expected config for package "${config._meta.package}"`);
  }

  if (config._meta.isLoaded) {
    if (allowOverride) {
      console.warn(`WARNING: Overriding config for "${config._meta.package}"!`);
    } else {
      throw new ConfigError(`Can't override config "${config._meta.package}" as it is already set`);
    }
  }

  const subData = config._meta.schema.parse(allData[config._meta.package]);
  Object.assign(config, subData);
  if (!config._meta.isLoaded) {
    config._meta.isLoaded = true;
    config._meta._resolve();
    console.debug("MARKING", config._meta.package, "AS LOADED");
  }
}

export async function setConfig<
  PackageName extends string,
  ConfigSchema extends ZodObject,
  SubSchemas extends Record<string, ZodObject>,
>(
  config: Config<ConfigMeta<PackageName, ConfigSchema, SubSchemas>, ConfigSchema>,
  inputData: ConfigData<PackageName, ConfigSchema, SubSchemas>,
  opts?: { forceOverride: boolean }
) {
  const override = opts?.forceOverride ?? false;
  setSingleConfig(config, inputData, override);

  for (const subConfig of Object.values(config._meta.subConfigs)) {
    setSingleConfig(subConfig, inputData, override);
  }
}
