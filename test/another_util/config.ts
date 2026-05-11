import { loadConfigProfile, loadProfileByEnvVar } from "../../dist/index.js";
import { another_util } from "./config-def.ts";

const loader = loadProfileByEnvVar('CONFIG', (profile) => import(`../complex/${profile}.ts`).then(x => x.default));

export const CONFIG = await loadConfigProfile(another_util, loader);

