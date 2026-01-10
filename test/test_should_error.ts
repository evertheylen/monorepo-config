import { setConfig } from "../dist/index.js";
import { CONFIG } from "./some_util/config.ts";

console.log("UtilConfig.foo is", CONFIG.foo);

//@ts-expect-error
setConfig(CONFIG, {})

setConfig(CONFIG, {
  some_util: {
    //@ts-expect-error
    foo: 123
  }
});
