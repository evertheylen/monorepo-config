
import { loadFileIntoConfig } from "../dist/filebased.js";
import { ConfigError, setConfig } from "../dist/index.js";
import { FOO_CONFIG } from "./schema.js";
import { BAR_CONFIG } from "./schema2.js";

await loadFileIntoConfig(FOO_CONFIG);

console.assert(FOO_CONFIG.foo === 'foooo', 'foo');
console.assert(BAR_CONFIG.bar === 'baaaar', 'bar');

let hadError = false;
try {
  setConfig(FOO_CONFIG, {
    foo: 'boo'
  });
} catch (e) {
  hadError = true;
  console.assert(e instanceof ConfigError, `error correct type: ${e}`);
}
console.assert(hadError, 'had error');

console.log("no failures? everything is ok!");
