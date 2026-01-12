import { getConfig } from "../../dist/basic.js";
import { configDef } from "./config-def.ts";

export const config = await getConfig(configDef);
