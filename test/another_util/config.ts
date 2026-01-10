import z from "zod";
import { makeConfig } from "../../dist/index.js";
import { CONFIG as UtilConfig } from "../some_util/config.ts";

export const CONFIG = makeConfig({
  package: 'another_util',
  schema: z.object({
    foo2: z.string()
  }),
  subConfigs: [ UtilConfig ]
});
