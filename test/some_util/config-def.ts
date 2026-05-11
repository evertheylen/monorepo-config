import z from "zod";
import { defineConfig } from "../../dist/basic.js";

export const some_util = defineConfig({
  package: 'some_util',
  schema: z.object({
    foo: z.string()
  }),
  dependencies: []
});
