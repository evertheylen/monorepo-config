import z from "zod";
import { makeConfig, setConfig } from "../../src/basic.js";
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
});
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
});
// @ts-expect-error (missing scripts)
setConfig(oneMoreConfig, {
    'collection': { apikey: 'test' },
    'logger': { level: 'info' },
    'fmt': { color: 'red' },
});
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
const arr = ['foo', 'bar', 'quuz'];
const data = [logConfig, collectionConfig];
function mapRoutes(args) {
    return {};
}
;
// Example usage:
const ROUTES = [
    { _meta: { package: 'home', schema: 'welcome' } },
    { _meta: { package: 'profile', schema: 'i am devloper' } }
];
const res = mapRoutes({ subConfigs: ROUTES });
// Example usage:
const DATA = [{ a: 'a', b: 'b' }, { b: 'b', c: 'c' }];
//# sourceMappingURL=test.js.map