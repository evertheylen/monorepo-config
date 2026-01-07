# monorepo-config

Javascript package to help with managing configs, primarily for monorepos. Uses zod to validate.

## Basic usage

```ts
import { makeConfig, setConfig } from "monorepo-config";

export const CONFIG = makeConfig(z.object({
  foobar: z.string(),
}));

setConfig(CONFIG, { foobar: 'test' });

CONFIG.foobar // --> 'test';
```

Basic functionality is not much more than running `.parse` on your schema, some error reporting and being a bit smart regarding defaults. You can only `setConfig` once, otherwise use `forceOverrideConfig`.


## File-based usage

This is more interesting, and allows you to replace the mess of untyped, unchecked env vars across packages with something more manageable (inspired by [Django](https://docs.djangoproject.com/en/6.0/topics/settings/)).

Create a directory `src/configs`. Then create a file `src/configs/schema.ts`:

```ts
import { makeFileConfig } from "monorepo-config";

export const FOO_CONFIG = makeFileConfig({
  envVar: 'FOO_CONFIG',
  directory: import.meta.dirname,
  schema: z.object({
    foo: z.string()
  })
});
```

For simplicity, the name of the environment variable and the config object are the same. Now you can define "profiles" in the same directory, like `src/configs/production.ts`:

```ts
import { setConfig } from "monorepo-config";
import { FOO_CONFIG } from "./schema.js";

setConfig(FOO_CONFIG, {
  foo: 'bar'
});
```

Lastly, load the config file based on the environment variable `FOO_CONFIG` in a file `src/configs/config.ts` (or some other file that initializes global variables):

```ts
import { loadFileIntoConfig } from "monorepo-config";
import { FOO_CONFIG } from "./schema.js";

await loadFileIntoConfig(FOO_CONFIG);
```

The idea is to use the same environment variable for all packages in your monorepo (this mirrors `DJANGO_SETTINGS_MODULE`).


## Which to use?

You can mix both in your monorepo! Packages representing reusable libraries probably want to stick with the basic usage. Packages that represent apps probably want to define their own config in a file-based manner. In such cases, you are expected to do multiple `setConfig` calls in a "profile": one for the app itself and then multiple `setConfig` calls for the internal libraries the app uses.


## TODO

- [ ] Vite plugin
- [ ] Explore usage in tests
