import { CONFIG } from "./config.ts";

await CONFIG._meta.loaded;

export const thing = `hello ${CONFIG.foo}`;
