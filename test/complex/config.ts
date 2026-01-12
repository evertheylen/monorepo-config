import { configDef } from "./config-def.ts";
import { loadConfigProfile } from "../../dist/index.js";

export const config = await loadConfigProfile(configDef, 'CONFIG');

