import { getConfig } from "../../dist/basic.js";
import { some_util } from "./config-def.ts";

export const config = await getConfig(some_util);
