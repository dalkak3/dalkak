import { projectSchema } from "../src/type/mod.ts"
import { cases } from "../../../deps/ente.ts"

Deno.test("test", () => {
    Object.entries(cases).forEach(([name, project]) => {
        console.log(name)
        const result = projectSchema.safeParse(project, { reportInput: true })

        if (!result.success) {
            console.log(JSON.parse(result.error.message))
            throw new Error(`Zod validation failed on "${name}"`)
        }
    })
})
