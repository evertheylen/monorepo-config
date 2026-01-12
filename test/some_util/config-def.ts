import z from "zod";
import { defineConfig } from "../../dist/basic.js";

export const configDef = defineConfig({
  package: 'some_util',
  schema: z.object({
    foo: z.string()
  }),
  dependencies: []
});
