import { z } from "../../../deps/zod.ts"
import * as schema from "./schema/mod.ts"

type Type = {
    [K in keyof typeof schema]: z.infer<typeof schema[K]>
}

export const {
    Picture,
    Sound,
    Object_,
    Variable,
    Message,
    Scene,
    Function,
    Table,
    Project,
    Block,
    Comment,
    Script,
} = schema

export type Picture = Type["Picture"]
export type Sound = Type["Sound"]
export type Object_ = Type["Object_"]
export type Variable = Type["Variable"]
export type Message = Type["Message"]
export type Scene = Type["Scene"]
export type Function = Type["Function"]
export type Table = Type["Table"]
export type Project = Type["Project"]
export type Block = Type["Block"]
export type Comment = Type["Comment"]
export type Script = Type["Script"]
