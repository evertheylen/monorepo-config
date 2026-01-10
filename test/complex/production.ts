import type { CONFIG } from './schema.ts';

export default {
  complex: { bla: 'bla' },
  another_util: { foo2: 'test' },
  some_util: { foo: 'bar' }
} satisfies typeof CONFIG._meta.input;
