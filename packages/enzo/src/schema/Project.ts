import { z } from "../../../../deps/zod.ts"

import { Block, Script } from "./Script.ts"
import { Object_ } from "./Object_.ts"
import { entryId, jsonString } from "./util.ts"

const saneNumber =
(input: number | string) => {
    if (typeof input == "number") {
        return input
    }
    if (input.match(/^[-+]?\d*(\.\d+)?$/)) {
        return Number(input)
    } else {
        return input
    }
}

const numberLike = z.union([z.string(), z.number()])
    .pipe(z.transform(saneNumber))
    .pipe(z.number())

export const Variable = z.strictObject({
    name: z.string(),
    variableType: z.enum([
        "variable",
        "list",
        "timer",
        "answer",
        "slide",
    ]),
    id: entryId,
    value: z.union([z.string(), z.number()]).optional(),
    minValue: numberLike.optional(),
    maxValue: numberLike.optional(),
    visible: z.boolean(),
    x: z.number(),
    y: z.number(),
    width: z.number().min(0).optional(),
    height: z.number().min(0).optional(),
    isCloud: z.boolean(),
    object: entryId.nullable(),
    array: z.array(
        z.strictObject({
            _key: z.string().regex(/^[0-9a-z]{33}$/).optional(),
            key: z.string().regex(/^[0-9a-z]{33}$/).optional(),
            data: z.union([z.string(), z.number()]).nullable(),
        }),
    ).optional(),
    isRealTime: z.boolean().optional(),
    cloudDate: z.literal(false).optional(),
})

export const Message = z.strictObject({
    _id: z.hex().length(24).optional(),
    name: z.string(),
    id: entryId,
})

export const Scene = z.strictObject({
    _id: z.hex().length(24).optional(),
    name: z.string(),
    id: entryId,
})

export const Function = z.strictObject({
    id: entryId,
    type: z.enum(["normal", "value"])
        .optional(),
    localVariables: z
        .array(
            z.strictObject({
                name: z.string(),
                value: z.union([z.string(), z.number()]),
                id: z.string().regex(/^[0-9a-z]{4}_[0-9a-z]{4}$/),
            }),
        )
        .optional(),
    useLocalVariables: z.boolean().optional(),
    content: jsonString(Script)
        .refine(blockss => blockss
            .filter(blocks =>
                blocks[0].type == "function_create"
                || blocks[0].type == "function_create_value"
            )
            .length == 1
        , "Function doesn't have exactly 1 head")
        .refine(blockss => {
            const blocks = blockss
                .find(blocks =>
                    blocks[0].type == "function_create"
                    || blocks[0].type == "function_create_value"
                )!
            if (blocks.length == 1) {
                // new func style
                return true
            } else if (!(blocks[0] as Block).statements?.length) {
                // old func style
                return true
            } else return false
        }),
    fieldNames: z.array(z.never()).optional(),
})

export const Table = z.strictObject({
    _id: z.hex().length(24),
    id: entryId,
    chart: z.array(z.never()),
    data: z.array(z.strictObject({
        key: z.string().regex(/^[0-9a-z]{33}$/),
        value: z.array(z.union([z.string(), z.number()])),
    })),
    fields: z.array(z.string()),
    name: z.string(),
    project: z.hex().length(24),
    user: z.hex().length(24),
    type: z.literal("user"),
    updated: z.iso.datetime(),
    created: z.iso.datetime(),
    __v: z.literal(0),
})

export const Project = z.strictObject({
    id: z.hex().length(24).optional(),
    updated: z.iso.datetime().optional(),
    name: z.string().optional(),
    thumb: z.string().regex(/^\/?uploads\/thumb\/[0-9a-f]{4}\/[0-9a-f]{24}\.png$/).optional(),
    cloudVariable: z.union([
        jsonString(z.array(Variable)),
        z.array(Variable),
    ]).optional(),

    speed: z.number().optional(),
    objects: z.array(Object_),
    variables: z.array(Variable),
    messages: z.array(Message),
    functions: z.array(Function),
    scenes: z.array(Scene),
    tables: z.array(Table),
    interface: z.object({
        menuWidth: z.literal(280).optional(),
        canvasWidth: z.number().min(0),
        object: entryId,
    }).optional(),
    expansionBlocks: z.array(z.never()).optional(),
    aiUtilizeBlocks: z.array(z.never()).optional(),
    hardwareLiteBlocks: z.array(z.never()).optional(),
    externalModules: z.array(z.never()).optional(),
    externalModulesLite: z.array(z.never()).optional(),
})
