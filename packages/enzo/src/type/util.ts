import { z } from "../../deps/zod.ts"

export const entryId = z.string().regex(/^[0-9a-z]{4}$/)

export const jsonString =
<T extends z.ZodType>
(schema: T) => z.string().pipe(
    z.preprocess((input, ctx) => {
        try {
            return JSON.parse(input)
        } catch {
            ctx.issues.push({
                code: "custom",
                message: "Invalid JSON",
                input,
            })
        }
    }, schema),
)
