import z from 'zod';
import { defineConfig, type MergeConfigTypes } from '../../dist/index.js';
import type { complex } from './config-def.ts';

// alternative profile not using a configDef, but pure types:

const optional = defineConfig({
  package: 'optional',
  schema: z.object({
    bla: z.string()
  }),
  dependencies: [ ],
});


export type Config = MergeConfigTypes<[
  typeof complex,
], [
  // test optional configs
  typeof optional
]>;


export default {
  complex: { bla: 'STAGING' },
  another_util: { foo2: 'STAGING' },
  some_util: { foo: 'STAGING' },
  optional: { bla: 'test' },
} satisfies Config;

// test optionality
const _x = {
  complex: { bla: 'STAGING' },
  another_util: { foo2: 'STAGING' },
  some_util: { foo: 'STAGING' },
} satisfies Config;
