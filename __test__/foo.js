import { setConfig } from "../dist/index.js";
import { FOO_CONFIG } from "./schema.js";
import { BAR_CONFIG } from "./schema2.js";

setConfig(FOO_CONFIG, {
  foo: 'foooo'
});

setConfig(BAR_CONFIG, {
  bar: 'baaaar'
});
