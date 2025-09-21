import { assertSnapshot } from "https://esm.sh/jsr/@std/testing@1.0.15/snapshot"

import { proj_57d79d29a76b6b017780b483 as proj } from "https://esm.sh/gh/dalkak3/ente@0.1.1/case/mod.ts?standalone"

import { projectSchema } from "../../enzo/src/type/mod.ts"
import { Project } from "../mod.ts"

Deno.test("basic", async t => {
    const a = Project(projectSchema.parse(proj))

    await assertSnapshot(t, a)
})
