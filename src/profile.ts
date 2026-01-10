import type { ZodObject } from "zod";
import { Config, ConfigError, ConfigMeta, setConfig } from "./basic.js";
import { join } from "path";

export async function loadProfileIntoConfig<
  PackageName extends string,
  ConfigSchema extends ZodObject,
  SubSchemas extends Record<string, ZodObject>,
>(
  config: Config<ConfigMeta<PackageName, ConfigSchema, SubSchemas> & { profileDir: string, profileSuffix?: string }, ConfigSchema>,
  envVar: string,
  profileDir?: string,
): Promise<void>

export async function loadProfileIntoConfig<
  PackageName extends string,
  ConfigSchema extends ZodObject,
  SubSchemas extends Record<string, ZodObject>,
>(
  config: Config<ConfigMeta<PackageName, ConfigSchema, SubSchemas> & { profileSuffix?: string }, ConfigSchema>,
  envVar: string,
  profileDir: string,
): Promise<void>

export async function loadProfileIntoConfig<
  PackageName extends string,
  ConfigSchema extends ZodObject,
  SubSchemas extends Record<string, ZodObject>,
>(
  config: Config<ConfigMeta<PackageName, ConfigSchema, SubSchemas> & { profileDir: string, profileSuffix?: string }, ConfigSchema>,
  envVar: string,
  profileDir?: string,
): Promise<void> {
  const configName = process.env[envVar];
  if (configName === undefined) {
    throw new ConfigError(`Please set the environment variable ${envVar}`);
  }
  const path = join(profileDir ?? config._meta.profileDir, `${configName}.${config._meta.profileSuffix ?? 'js'}`);
  const data = (await import(path)).default;
  setConfig(config, data);

  if (!config._meta.isLoaded) {
    console.warn(`Imported ${path} but config was still not marked as set`);
  }
}

