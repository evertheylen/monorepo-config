import z from "zod";
import { makeConfig } from "../../dist/index.js";

export const CONFIG = makeConfig({
  package: 'some_util',
  schema: z.object({
    foo: z.string()
  }),
  subConfigs: []
});
