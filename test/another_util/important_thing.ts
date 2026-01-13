import { thing } from "../some_util/useful_thing.ts";
import { CONFIG } from "./config.ts";

export const importantThing = CONFIG.foo2 + '-' + thing;
