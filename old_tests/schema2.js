
import z from "zod";
import { makeConfig } from "../dist/index.js";

export const BAR_CONFIG = makeConfig(z.object({
  bar: z.string().default('this is default'),
  optionalBar: z.string().optional(),
}));

console.assert(BAR_CONFIG.bar === 'this is default', 'bar default');
console.assert(BAR_CONFIG.optionalBar === undefined, 'bar optional');
