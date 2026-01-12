import z from "zod";
import { defineConfig, getConfig, setConfig } from "../../dist/index.js";

import { configDef as some_util } from "../some_util/config-def.ts";

console.log("simple/config.ts: start")

export const configDef = defineConfig({
  package: "simple",
  schema: z.object({
    enabled: z.boolean(),
    foo: z.string().default('bar'),
  }),
  dependencies: [ some_util ]
});

console.log("simple/config.ts: made config")

// NOTE: This is not the intended way to use this library, you should
// make two files with config-def and config.

setConfig(configDef, {
  simple: { enabled: true },
  some_util: { foo: 'world' }
})

console.log("simple/config.ts: config set");

export const config = await getConfig(configDef);
