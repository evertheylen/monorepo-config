import { setConfig } from "../dist/basic.js";
import { UtilConfig } from "./some_util/config.ts";

console.log("UtilConfig.foo is", UtilConfig.foo);

//@ts-expect-error
setConfig(UtilConfig, {})

setConfig(UtilConfig, {
  some_util: {
  //@ts-expect-error
    foo: 123
  }
});
