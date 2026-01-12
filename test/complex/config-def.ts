import z from "zod";
import { defineConfig } from "../../dist/index.js";
import { configDef as another_util } from "../another_util/config-def.ts";

export const configDef = defineConfig({
  package: 'complex',
  schema: z.object({
    bla: z.string()
  }),
  dependencies: [ another_util ],
  profileDir: import.meta.dirname,
  profileSuffix: 'ts',
});
