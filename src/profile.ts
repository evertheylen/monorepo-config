import type { output, ZodObject } from "zod";
import { ConfigError, ConfigDefinition, setConfig } from "./basic.js";
import { join } from "path";

export async function loadConfigProfile<
  PackageName extends string,
  ConfigSchema extends ZodObject,
  SubSchemas extends Record<string, ZodObject>,
>(
  config: ConfigDefinition<PackageName, ConfigSchema, SubSchemas> & { profileDir: string, profileSuffix?: string },
  envVar: string,
  profileDir?: string,
): Promise<output<ConfigSchema>>

export async function loadConfigProfile<
  PackageName extends string,
  ConfigSchema extends ZodObject,
  SubSchemas extends Record<string, ZodObject>,
>(
  config: ConfigDefinition<PackageName, ConfigSchema, SubSchemas> & { profileSuffix?: string },
  envVar: string,
  profileDir: string,
): Promise<output<ConfigSchema>>

export async function loadConfigProfile<
  PackageName extends string,
  ConfigSchema extends ZodObject,
  SubSchemas extends Record<string, ZodObject>,
>(
  config: ConfigDefinition<PackageName, ConfigSchema, SubSchemas> & { profileDir?: string, profileSuffix?: string },
  envVar: string,
  profileDir?: string,
): Promise<output<ConfigSchema>> {
  const configName = process.env[envVar];
  if (configName === undefined) {
    throw new ConfigError(`Please set the environment variable ${envVar}`);
  }
  profileDir = profileDir ?? config.profileDir;
  if (profileDir === undefined) {
    throw new ConfigError(`Either give profileDir as an argument or set profileDir in the config metadata`);
  }
  const path = join(profileDir, `${configName}.${config.profileSuffix ?? 'js'}`);
  const data = (await import(path)).default;
  setConfig(config, data);

  if (!config.isLoaded) {
    console.warn(`Imported ${path} but config was still not marked as set`);
  }

  return config.output;
}

