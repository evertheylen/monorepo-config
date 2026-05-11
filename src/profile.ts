import type { output, ZodObject } from "zod";
import { ConfigError, ConfigDefinition, setConfig } from "./basic.js";

export type ProfileLoader = (profile: string) => Promise<object>;

const ProfileName: unique symbol = Symbol('monorepo-config:ProfileName');

export function loadProfileByEnvVar(envVar: string, importer: ProfileLoader): () => Promise<object> {
  return async () => {
    const profileName = process.env[envVar];
    if (profileName === undefined) {
      throw new ConfigError(`Please set the environment variable ${envVar}`);
    }

    const res = await importer(profileName);
    (res as any)[ProfileName] = profileName;
    return res;
  }
}

export async function loadConfigProfile<
  PackageName extends string,
  ConfigSchema extends ZodObject,
  SubSchemas extends Record<string, ZodObject>,
>(
  config: ConfigDefinition<PackageName, ConfigSchema, SubSchemas> & { loader: () => Promise<object> },
  loader?: () => Promise<object>,
): Promise<output<ConfigSchema>>

export async function loadConfigProfile<
  PackageName extends string,
  ConfigSchema extends ZodObject,
  SubSchemas extends Record<string, ZodObject>,
>(
  config: ConfigDefinition<PackageName, ConfigSchema, SubSchemas>,
  loader: () => Promise<object>,
): Promise<output<ConfigSchema>>

export async function loadConfigProfile<
  PackageName extends string,
  ConfigSchema extends ZodObject,
  SubSchemas extends Record<string, ZodObject>,
>(
  config: ConfigDefinition<PackageName, ConfigSchema, SubSchemas> & { loader?: () => Promise<object> },
  loader?: () => Promise<object>,
): Promise<output<ConfigSchema>> {
  loader = loader ?? config.loader;
  if (loader === undefined) {
    throw new ConfigError(`Either give loader as an argument or set loader in the config metadata`);
  }
  
  const data = await loader();
  setConfig(config, data as any);

  if (!config.isLoaded) {
    const profileName = (data as any)[ProfileName];
    console.warn(`WARNING: Imported config (profile ${profileName}) for ${config.package} but config was still not marked as set`);
  }

  return config.output;
}

