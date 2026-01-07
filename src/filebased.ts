import type { ZodObject } from "zod";
import { Config, ConfigError, makeConfig } from "./index.js";
import { join } from "path";

export type FileConfig<ConfigSchema extends ZodObject> = Config<ConfigSchema> & {
  _meta: {
    configDir: string;
    envVar: string;
  }
};

export function makeFileConfig<ConfigSchema extends ZodObject>(opts: {
  envVar: string, directory: string, schema: ConfigSchema, preventAutoLoad?: boolean
}): FileConfig<ConfigSchema> {
  const cfg = makeConfig(opts.schema) as FileConfig<ConfigSchema>;
  // imperative overrides here to not lose the Proxy
  cfg._meta.configDir = opts.directory;
  cfg._meta.envVar = opts.envVar;

  if (!opts.preventAutoLoad) {
    queueMicrotask(async () => {
      try {
        await loadFileIntoConfig(cfg);
      } catch (e) {
        console.error(e);
        process.exit(1);
      }
    });
  }

  return cfg;
}

export async function loadFileIntoConfig<ConfigSchema extends ZodObject>(config: FileConfig<ConfigSchema>) {
  const config_name = process.env[config._meta.envVar];
  if (config_name === undefined) {
    throw new ConfigError(`Please set the environment variable ${config._meta.envVar}`);
  }
  const path = join(config._meta.configDir, `${config_name}.js`);
  await import(path);
  if (!config._meta.isUsable) {
    console.warn(`Imported ${path} but config was still not marked as usable`);
  }
}

