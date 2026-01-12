import z from "zod";
import { defineConfig } from "../../dist/index.js";
import { configDef as some_util } from "../some_util/config-def.ts";

export const configDef = defineConfig({
  package: 'another_util',
  schema: z.object({
    foo2: z.string()
  }),
  dependencies: [ some_util ]
});
