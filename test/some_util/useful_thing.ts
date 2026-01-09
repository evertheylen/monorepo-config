import { UtilConfig } from "./config.ts";

console.log("someutil/useful_thing.ts: started")

await UtilConfig._meta.loaded;

console.log("useful_thing: config loaded")

export const thing = `hello ${UtilConfig.foo}`;

console.log("some_util: useful thing is ", thing);
