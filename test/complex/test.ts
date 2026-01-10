import { importantThing } from "../another_util/important_thing.ts";
import { CONFIG } from "./config.ts";

// Run with env var CONFIG=production

console.log("complex/test.ts: CONFIG bla is", CONFIG.bla);
console.log("complex/test.ts: important thing is", importantThing);
