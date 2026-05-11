import z from "zod";
import { defineConfig } from "../../dist/index.js";
import { another_util as another_util } from "../another_util/config-def.ts";

export const complex = defineConfig({
  package: 'complex',
  schema: z.object({
    bla: z.string()
  }),
  dependencies: [ another_util ],
});
