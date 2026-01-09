import z from "zod";
import { makeConfig, setConfig } from "../../src/basic.ts";
import { UtilConfig } from "../some_util/config.ts";

console.log("simple/config.ts: start")

const simpleConfig = makeConfig({
  package: "simple",
  schema: z.object({
    enabled: z.boolean(),
    foo: z.string().default('bar'),
  }),
  subConfigs: [ UtilConfig ]
});

console.log("simple/config.ts: made config")

setConfig(simpleConfig, {
  simple: { enabled: true },
  some_util: { foo: 'world' }
})

console.log("config set");
