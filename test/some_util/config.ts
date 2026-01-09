import z from "zod";
import { makeConfig } from "../../src/basic.ts";

export const UtilConfig = makeConfig({
  package: 'some_util',
  schema: z.object({
    foo: z.string()
  }),
  subConfigs: []
});
