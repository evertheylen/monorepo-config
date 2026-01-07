import type { ZodObject, input, output } from "zod";

export class ConfigError extends Error { }

export type Config<ConfigSchema extends ZodObject> = {
  _meta: {
    isUsable: boolean,
    canSet: boolean,
    schema: ConfigSchema,
  }
} & output<ConfigSchema>;

function wrapInProxy<ConfigSchema extends ZodObject>(obj: Config<ConfigSchema>) {
  return new Proxy(obj, {
    get(target, prop, receiver) {
      if (prop === '_meta') {
        return target._meta;
      }
      if (!target._meta.isUsable) {
        throw new Error("Tried to access config but it is not usable yet. Did you forget to set or load the config?");
      }
      return (target as any)[prop];
    }
  });
}

export function makeConfig<ConfigSchema extends ZodObject>(schema: ConfigSchema): Config<ConfigSchema> {
  const zodDefaults = schema.safeParse({});

  if (zodDefaults.success) {
    // all attributes had defaults
    return wrapInProxy({
      _meta: {
        schema: schema,
        isUsable: true,
        canSet: true,
      },
      ...zodDefaults.data
    });
  } else {
    // zod couldn't handle an empty object
    // @ts-expect-error for simplicity, the types assume that config is always defined.
    return wrapInProxy({
      _meta: {
        schema: schema,
        isUsable: false,
        canSet: true,
      }
    });
  }
}

export function forceOverrideConfig<ConfigSchema extends ZodObject>(config: Config<ConfigSchema>, inputData: input<ConfigSchema>) {
  const outputData = config._meta.schema.parse(inputData);
  Object.assign(config, outputData);
  config._meta.isUsable = true;
  config._meta.canSet = false;
}

export function setConfig<ConfigSchema extends ZodObject>(config: Config<ConfigSchema>, inputData: input<ConfigSchema>) {
  if (config._meta.canSet) {
    forceOverrideConfig(config, inputData);
  } else {
    throw new ConfigError("Can't override config as it is already set");
  }
}

