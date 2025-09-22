import { expandGlob } from "https://esm.sh/jsr/@std/fs@1.0.19/expand-glob"

for await (const { path } of expandGlob("./**/*.json.ts")) {
    const data = (await import("file://"+path)).default
    let out: string
    if (typeof data == "object") {
        out = JSON.stringify(data, undefined, 2)
    } else if (typeof data == "string") {
        out = data
    } else {
        throw "?"
    }
    await Deno.writeTextFile(path.slice(0, -3), out)
}
