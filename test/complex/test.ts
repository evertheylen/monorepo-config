import { importantThing } from "../another_util/important_thing.ts";
import { config } from "./config.ts";

// Run with env var CONFIG=production

console.log("complex/test.ts: CONFIG bla is", config.bla);
console.log("complex/test.ts: important thing is", importantThing);
