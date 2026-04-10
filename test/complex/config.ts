import { configDef } from "./config-def.ts";
import { loadConfigProfile, loadProfileByEnvVar } from "../../dist/index.js";

export const loader = loadProfileByEnvVar('CONFIG', (profile) => import(`./${profile}.ts`).then(x => x.default))

export const config = await loadConfigProfile(configDef, loader);

