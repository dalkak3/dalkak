import { z } from "../../deps/zod.ts"

import { Block, scriptSchema } from "./Script.ts"
import { objectSchema } from "./Object_.ts"
import { entryId, jsonString } from "./util.ts"

export const variableSchema = z.strictObject({
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
    minValue: z.union([z.string(), z.number()]).optional(),
    maxValue: z.union([z.string(), z.number()]).optional(),
    visible: z.boolean(),
    x: z.number(),
    y: z.number(),
    width: z.number().min(0).optional(),
    height: z.number().min(0).optional(),
    isCloud: z.boolean(),
    object: entryId.nullable(),
    array: z.array(
        z.strictObject({
            key: z.string().regex(/^[0-9a-z]{33}$/).optional(),
            data: z.union([z.string(), z.number()]).nullable(),
        }),
    ).optional(),
    isRealTime: z.boolean().optional(),
    cloudDate: z.literal(false).optional(),
})

export const messageSchema = z.strictObject({
    _id: z.hex().length(24).optional(),
    name: z.string(),
    id: entryId,
})

export const sceneSchema = z.strictObject({
    _id: z.hex().length(24).optional(),
    name: z.string(),
    id: entryId,
})

export const functionSchema = z.strictObject({
    id: entryId,
    type: z.enum(["normal", "value"])
        .optional(),
    localVariables: z
        .array(
            z.strictObject({
                name: z.string(),
                value: z.number(),
                id: z.string().regex(/^[0-9a-z]{4}_[0-9a-z]{4}$/),
            }),
        )
        .optional(),
    useLocalVariables: z.boolean().optional(),
    content: jsonString(scriptSchema)
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

export const tableSchema = z.strictObject({
    _id: z.hex().length(24),
    id: entryId,
    chart: z.array(z.never()),
    data: z.array(z.strictObject({
        key: z.string().regex(/^[0-9a-z]{33}$/),
        value: z.array(z.number()),
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

export const projectSchema = z.strictObject({
    id: z.hex().length(24).optional(),
    updated: z.iso.datetime().optional(),
    name: z.string().optional(),
    thumb: z.string().regex(/^\/?uploads\/thumb\/[0-9a-f]{4}\/[0-9a-f]{24}\.png$/).optional(),
    cloudVariable: z.union([
        jsonString(z.array(variableSchema)),
        z.array(variableSchema),
    ]).optional(),

    speed: z.number().optional(),
    objects: z.array(objectSchema),
    variables: z.array(variableSchema),
    messages: z.array(messageSchema),
    functions: z.array(functionSchema),
    scenes: z.array(sceneSchema),
    tables: z.array(tableSchema),
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
