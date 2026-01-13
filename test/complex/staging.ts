import type { MergeConfigTypes } from '../../dist/index.js';
import type { configDef } from './config-def.ts';

// alternative profile not using a configDef, but pure types:

type Config = MergeConfigTypes<[typeof configDef]>;

export default {
  complex: { bla: 'STAGING' },
  another_util: { foo2: 'STAGING' },
  some_util: { foo: 'STAGING' }
} satisfies Config;
