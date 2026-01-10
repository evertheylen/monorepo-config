import z from "zod";
import { makeConfig, setConfig } from "../../dist/index.js";
import * as some_util from "../some_util/config.ts";

console.log("simple/config.ts: start")

const CONFIG = makeConfig({
  package: "simple",
  schema: z.object({
    enabled: z.boolean(),
    foo: z.string().default('bar'),
  }),
  subConfigs: [ some_util.CONFIG ]
});

console.log("simple/config.ts: made config")

setConfig(CONFIG, {
  simple: { enabled: true },
  some_util: { foo: 'world' }
})

console.log("config set");
