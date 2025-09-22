import * as e from "../enzo/src/mod.ts"

import { Block, Folder, Literal } from "./src/type.ts"

const meta =
(record: Record<string, Literal>) => Block(
    "when init",
    Object.entries(record)
        .map(([k, v]) => Block(`set ${k}`, v)),
)

const Picture =
(picture: e.Picture) => Folder(
    picture.name,
    [],
    [
        meta({
            width: picture.dimension.width,
            height: picture.dimension.height,
        }),
    ],
)

const Sound =
(sound: e.Sound) => Folder(
    sound.name,
    [],
    [
        meta({
            src: sound.fileurl || sound.filename || "",
        }),
    ],
)

const Block_ =
(block: e.Block): Block => [
    block.type,
    ...block.params
        .filter(x => x != null)
        .map(x => typeof x == "object" ? Block_(x) : x),
    ...(block.statements || [])
        .filter(x => !!x)
        .map(x => x.map(Block_))
]

const BlockGroup =
(blockOrComments: (e.Block | e.Comment)[]): [] | [Block] => {
    const blocks = blockOrComments
        .filter(x => x.type != "comment") as e.Block[]

    if (blocks.length == 0) return []

    return blocks[0].type.startsWith("when_")
        ? [[...Block_(blocks[0]), blocks.slice(1).map(Block_)]]
        : [["when_void", blocks.map(Block_)]]
}

const Object_ =
(object: e.Object_) => Folder(
    object.name,
    [
        ...object.sprite.pictures.map(Picture),
        ...object.sprite.sounds.map(Sound),
    ],
    [
        meta({
            width: object.entity.width,
            height: object.entity.height,
        }),
        ...object.script.flatMap(BlockGroup),
    ],
)

export const Project =
(project: e.Project) =>
    Folder(project.name || project.id || "Unnamed Project", [
        ...project.scenes.map(scene => Folder(scene.name, [
            ...project.objects
                .filter(object => object.scene == scene.id)
                .map(Object_)
        ])),
    ])
