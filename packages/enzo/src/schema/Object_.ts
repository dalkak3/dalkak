import { z } from "../../../../deps/zod.ts"

import { Script } from "./Script.ts"
import { entryId, jsonString } from "./util.ts"

const filename = z.string().regex(/^[0-9a-z]{32}$/)

export const Picture = z.strictObject({
    _id: z.hex().length(24).optional(),
    id: entryId,
    name: z.string(),
    dimension: z.strictObject({
        width: z.number().min(0),
        height: z.number().min(0),

        scaleX: z.number().min(-1).optional(),
            // min(-1): this is not a typo (sigh)

        scaleY: z.number().min(0).optional(),
    }),
    scale: z.number().optional(),
    imageType: z.enum(["png", "svg"]).optional(),
    fileurl: z.string().nullable().optional(),
    filename: filename.optional(),
    thumbUrl: z.string().optional(),
})

export const Sound = z.strictObject({
    _id: z.hex().length(24).optional(),
    id: entryId,
    name: z.string(),
    duration: z.number(),
    fileurl: z.string().optional(),
    filename: filename.optional(),
    ext: z.literal(".mp3").optional(),
})

const color = z.string().regex(/^#[0-9A-F]{6}|#[0-9a-f]{6}$|#[0-9a-f]{8}$/)

export const Object_ = z.strictObject({
    _id: z.hex().length(24).optional(),
    id: entryId,
    name: z.string(),
    text: z.string().optional(),
    objectType: z.enum(["sprite", "textBox"]),
    scene: entryId,
    active: z.boolean().optional(),
    lock: z.boolean(),
    rotateMethod: z.enum(["free", "vertical", "none"]),
    entity: z.strictObject({
        rotation: z.number().min(0).max(360),
        direction: z.number().min(0).max(360),
        x: z.number(),
        y: z.number(),
        regX: z.number(),
        regY: z.number(),

        scaleX: z.number().min(-1),
            // min(-1): this is not a typo (sigh)
        
        scaleY: z.number().min(0),
        width: z.number().min(0),
        height: z.number().min(0),
        visible: z.boolean(),
        colour: color.optional(),
        font: z.templateLiteral([
            z.literal("bold ").optional(),
            z.literal("italic ").optional(),
            z.union([z.number(), z.literal("undefined")]),
            "px ",
            z.enum([
                "",
                "Nanum Gothic",
                "NanumGothic",
                "Nanum Myeongjo",
                "Nanum Barun Pen",
                "Nanum Pen Script",
                "NanumSquareRound",
                "MaruBuri",
                "NotoSans",
                "D2 Coding",
                "yg-jalnan",
                "designhouseOTFLight00",
                "DungGeunMo",
                "UhBeemysen",
                "SDComicStencil",
                "SDChildfundkorea",
                "SDCinemaTheater",
                "SDMapssi",
                "SDShabang",
                "SDWoodcarving",
                "SDYongbi",
                "Nanum Gothic Coding",
                "KoPub Batang",
                "NanumSquareWebfont",
            ]),
        ]).nullable(),
        bgColor: z.union([color, z.literal("transparent")]).optional(),
        textAlign: z.number().optional(),
        lineBreak: z.boolean().optional(),
        underLine: z.boolean().optional(),
        strike: z.boolean().optional(),
        text: z.string().optional(),
        fontSize: z.number().optional(),
    }),
    script: jsonString(Script),
    sprite: z.strictObject({
        pictures: z.array(Picture),
        sounds: z.array(Sound),
    }),
    selectedPictureId: entryId.optional(),
    selectedSoundId: entryId.optional(),
})
