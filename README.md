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

**Still being worked on! Typescript imports may lead to dependency cycles, which breaks some tools.**

This allows you to replace the mess of untyped, unchecked env vars across packages with something more manageable (inspired by [Django](https://docs.djangoproject.com/en/6.0/topics/settings/)). You can load the chosen configuration based on a single environment variable like so:

```ts
import { loadConfigProfile } from "monorepo-config";
import { configDef } from "./config-def.ts";

export const loader = loadProfileByEnvVar('FOOBAR_CONFIG', (profile) => import(`./${profile}.js`).then(x => x.default))

export const FOOBAR_CONFIG = await loadConfigProfile(configDef, loader);
```

Profiles are just typescript files like this:

```ts
import type { MergeConfigTypes } from "monorepo-config";
import type { configDef } from "./config-def.ts";
import type { otherConfigDef } from "other-package/config-def.ts";

type Config = MergeConfigTypes<[
  typeof configDef, typeof otherConfig, ...
]>;

export default {
  'your-package': {
    foobar: 'quuz'
  },
  'other-config': { ... }
} satisfies Config;
```

You can split up the above as you wish. You can choose, like the example, to use the same name for the configuration object as the environment variable. The idea is to use the same environment variable for all packages in your monorepo (this mirrors `DJANGO_SETTINGS_MODULE`).


## Which to use?

You can mix both in your monorepo! Packages representing reusable libraries probably want to stick with the basic usage and let other packages define their config. Packages that represent apps probably want to define their own config using profiles.


## Common errors

### Package name '...' is used for two different config definitions

Your package manager may have included two different copies of the same code. Run `pnpm dedupe`, or manually inspect your lockfile to verify this. If not, add `console.trace()` calls to the `defineConfig` function to figure out exactly where the configs are defined.


## TODO

- [ ] Vite plugin

