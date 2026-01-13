import { join } from "path";
import { loadConfigProfile } from "../../dist/index.js";
import { configDef } from "./config-def.ts";

// loading config from central profile directory
console.log("dirname", join(import.meta.dirname, '../complex'));
export const CONFIG = await loadConfigProfile(configDef, 'CONFIG', join(import.meta.dirname, '../complex'));

