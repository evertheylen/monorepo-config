import type { ZodObject } from "zod";
import { Config, ConfigError, ConfigMeta } from "./basic.js";
import { join } from "path";

export async function loadFileIntoConfig<
  PackageName extends string,
  ConfigSchema extends ZodObject,
  SubSchemas extends Record<string, ZodObject>,
>(
  config: Config<ConfigMeta<PackageName, ConfigSchema, SubSchemas> & { configDir: string }, ConfigSchema>,
  envVar: string,
  configDir?: string,
): Promise<void>

export async function loadFileIntoConfig<
  PackageName extends string,
  ConfigSchema extends ZodObject,
  SubSchemas extends Record<string, ZodObject>,
>(
  config: Config<ConfigMeta<PackageName, ConfigSchema, SubSchemas>, ConfigSchema>,
  envVar: string,
  configDir: string,
): Promise<void>

export async function loadFileIntoConfig<
  PackageName extends string,
  ConfigSchema extends ZodObject,
  SubSchemas extends Record<string, ZodObject>,
>(
  config: Config<ConfigMeta<PackageName, ConfigSchema, SubSchemas> & { configDir: string }, ConfigSchema>,
  envVar: string,
  configDir?: string,
): Promise<void> {
  const config_name = process.env[envVar];
  if (config_name === undefined) {
    throw new ConfigError(`Please set the environment variable ${envVar}`);
  }
  const path = join(configDir ?? config._meta.configDir, `${config_name}.js`);
  await import(path);
  if (!config._meta.isLoaded) {
    console.warn(`Imported ${path} but config was still not marked as set`);
  }
}

