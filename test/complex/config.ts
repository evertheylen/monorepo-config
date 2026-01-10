import { CONFIG } from "./schema.ts";
import { loadProfileIntoConfig } from "../../dist/index.js";

await loadProfileIntoConfig(CONFIG, 'CONFIG');

export { CONFIG };
