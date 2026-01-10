import z from "zod";
import { makeConfig } from "../../dist/index.js";
import { CONFIG as AnotherUtilConfig } from "../another_util/config.ts";

export const CONFIG = makeConfig({
  package: 'complex',
  schema: z.object({
    bla: z.string()
  }),
  subConfigs: [ AnotherUtilConfig ],
  profileDir: import.meta.dirname,
  profileSuffix: 'ts',
});
