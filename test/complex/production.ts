import type { configDef } from './config-def.ts';

export default {
  complex: { bla: 'bla' },
  another_util: { foo2: 'test' },
  some_util: { foo: 'bar' }
} satisfies typeof configDef.input;
