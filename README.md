# monorepo-config

Javascript package to help with managing configs, primarily for monorepos. Uses zod to validate.

## Basic usage

Always split your config in two parts: one which defines the format/types, and another that actually gets the config data.

First create a `config-def.ts` file:

```ts
import { defineConfig } from "monorepo-config";
import { otherConfigDef } from "some-dependency"; // optional

export const configDef = makeConfig({
  package: 'your-package',
  schema: z.object({
    foobar: z.string(),
  }),
  depedencies: [ otherConfigDef ]
});
```

In another file `config.ts` you can do:

```ts
import { getConfig } from "monorepo-config";
import { configDef } from "./config-def.ts";

export const config = await getConfig(configDef);
```

Actually setting the config happens in yet another place. Using `setConfig(configDef, { ... })` directly can be tricky because of await-deadlocks. You probably want to use "profiles", as discussed next.


## Profile-based usage

This allows you to replace the mess of untyped, unchecked env vars across packages with something more manageable (inspired by [Django](https://docs.djangoproject.com/en/6.0/topics/settings/)).

First you can (optionally) set `profileDir` on your configuration definition:

```ts
export const configDef = makeConfig({
  package: 'your-package',
  schema: z.object({
    foobar: z.string(),
  }),
  depedencies: [ otherConfigDef ],
  profileDir: import.meta.dirname,
});
```

You can then load the chosen configuration based on a single environment variable like so:

```ts
import { loadConfigProfile } from "monorepo-config";
import { configDef } from "./config-def.ts";

export const FOOBAR_CONFIG = await loadConfigProfile(configDef, 'FOOBAR_CONFIG');
```

Profiles are just typescript files like this:

```ts
import type { configDef } from "./config-def.ts";

export default {
  'your-package': {
    foobar: 'quuz'
  },
  'other-config': { ... }
} satisfies typeof configDef.input;
```

You can choose, like the example, to use the same name the configuration object as the environment variable. The idea is to use the same environment variable for all packages in your monorepo (this mirrors `DJANGO_SETTINGS_MODULE`).


## Which to use?

You can mix both in your monorepo! Packages representing reusable libraries probably want to stick with the basic usage and let other packages define their config. Packages that represent apps probably want to define their own config using profiles.


## TODO

- [ ] Vite plugin

