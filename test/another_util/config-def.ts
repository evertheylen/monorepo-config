import z from "zod";
import { defineConfig } from "../../dist/index.js";
import { some_util as some_util } from "../some_util/config-def.ts";

export const another_util = defineConfig({
  package: 'another_util',
  schema: z.object({
    foo2: z.string()
  }),
  dependencies: [ some_util ],
  profileSuffix: 'ts',
});
