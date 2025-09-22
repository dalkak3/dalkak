import { Project } from "../src/mod.ts"
import { cases } from "../../../deps/ente.ts"

Deno.test("test", () => {
    Object.entries(cases).forEach(([name, project]) => {
        console.log(name)
        const result = Project.safeParse(project, { reportInput: true })

        if (!result.success) {
            Deno.writeTextFileSync(
                ".log.json",
                JSON.stringify(
                    JSON.parse(result.error.message),
                    undefined,
                    2,
                ),
            )
            throw new Error(`Zod validation failed on "${name}"`)
        }
    })
})
