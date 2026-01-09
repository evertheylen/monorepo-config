
import z from "zod";
import { makeFileConfig } from "../dist/filebased.js";

export const FOO_CONFIG = makeFileConfig({
  envVar: 'FOO_CONFIG',
  directory: import.meta.dirname,
  schema: z.object({
    foo: z.string()
  })
});

