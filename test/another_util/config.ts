import { loadConfigProfile, loadProfileByEnvVar } from "../../dist/index.js";
import { configDef } from "./config-def.ts";

const loader = loadProfileByEnvVar('CONFIG', (profile) => import(`../complex/${profile}.ts`).then(x => x.default));

export const CONFIG = await loadConfigProfile(configDef, loader);

