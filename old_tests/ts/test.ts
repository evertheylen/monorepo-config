import z from "zod";
import { AnyConfig, Config, ConfigData, makeConfig, setConfig } from "../../src/basic.js";

const fmtConfig = makeConfig({
  package: 'fmt',
  schema: z.object({ color: z.string() }),
  subConfigs: []
});

setConfig(fmtConfig, {
  fmt: { color: 'red' },
});

const logConfig = makeConfig({
  package: 'logger',
  schema: z.object({ level: z.string() }),
  subConfigs: [fmtConfig]
});

setConfig(logConfig, {
  logger: { level: 'info' },
  fmt: { color: 'red' }
});

const collectionConfig = makeConfig({
  package: 'collection',
  schema: z.object({ apikey: z.string() }),
  subConfigs: [logConfig]
});

setConfig(collectionConfig, {
  'collection': { apikey: 'test' },
  'logger': { level: 'info' },
  'fmt': { color: 'red' }
})

const oneMoreConfig = makeConfig({
  package: 'scripts',
  schema: z.object({ cwd: z.string() }),
  subConfigs: [collectionConfig],
});

setConfig(oneMoreConfig, {
  'collection': { apikey: 'test' },
  'logger': { level: 'info' },
  'fmt': { color: 'red' },
  'scripts': { cwd: 'sfd' }
})

// @ts-expect-error (missing scripts)
setConfig(oneMoreConfig, {
  'collection': { apikey: 'test' },
  'logger': { level: 'info' },
  'fmt': { color: 'red' },
})

setConfig(oneMoreConfig, {
  'collection': { apikey: 'test' },
  'logger': { level: 'info' },
  'fmt': { color: 'red' },
  'scripts': { cwd: 'sfd' },
  // @ts-expect-error (too many packages)
  'sdlfkjsdflkj': {}
});

setConfig(oneMoreConfig, {
  'collection': { apikey: 'test' },
  'logger': { level: 'info' },
  // @ts-expect-error (wrong type)
  'fmt': { color: true },
  'scripts': { cwd: 'sfd' },
});

// ---


const arr = ['foo', 'bar', 'quuz'] as const;

type A = typeof arr;

type X = {[i in keyof A & `${number}` as A[i]]: A[i]}

// ---

type Cfg<Name extends string, Content extends string> = {
  _meta: {
    package: Name,
    schema: Content,
  }
}


const data = [logConfig, collectionConfig];
type Debug<SCA extends AnyConfig[]> = {
  [SubSubPkg in keyof UnionToIntersection<SCA[number]['_meta']['subConfigs']>]: (
    // @ts-ignore
    UnionToIntersection<SCA[number]['_meta']['subConfigs']>[SubSubPkg]['_meta']['schema']
  )
};
type Y = Debug<typeof data>;

function mapRoutes<
  const SubConfigsArray extends Cfg<string, any>[]
>(args: {
  subConfigs: SubConfigsArray
}) {
  return {} as {
    [K in SubConfigsArray[number] as K['_meta']['package']]: K['_meta']['schema']
  }
};

// Example usage:
const ROUTES = [
  {_meta: { package: 'home' as const, schema: 'welcome' as const } },
  {_meta: { package: 'profile' as const, schema: 'i am devloper' as const } }
];

const res = mapRoutes({ subConfigs: ROUTES });


// ----

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

type MergeArray<T extends readonly object[]> = {
  [K in keyof UnionToIntersection<T[number]>]: UnionToIntersection<T[number]>[K];
};

// Example usage:
const DATA = [{ a: 'a', b: 'b' }, { b: 'b', c: 'c' }] as const;
type Merged = MergeArray<typeof DATA>;

