import { setConfig } from "../dist/index.js";
import { configDef } from "./some_util/config-def.ts";

//@ts-expect-error
setConfig(configDef, {})

setConfig(configDef, {
  some_util: {
    //@ts-expect-error
    foo: 123
  }
});
