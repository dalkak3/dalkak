import * as e from "../src/mod.ts"

const Block =
(block: e.Block | e.Comment): string[] => [
    block.type,
    ..."params" in block
        ? [
            ...block.params
                .filter(x => !!x && typeof x == "object")
                .flatMap(Block),
            ...(block.statements || [])
                .filter(x => !!x)
                .flatMap(x => x.flatMap(Block)),
        ]
        : [],
]

const Project =
(project: e.Project) => [
    ...project.objects.flatMap(object =>
        object.script.flatMap(blockGroup =>
            blockGroup.flatMap(Block)
        )
    ),
    ...project.functions.flatMap(func =>
        func.content.flatMap(blockGroup =>
            blockGroup.flatMap(Block)
        )
    )
]

import { cases } from "../../../deps/ente.ts"

const res = Object.entries(cases)
    .flatMap(([, v]) => Project(e.Project.parse(v)))
    .filter(x => !x.match(/^func_[0-9a-z]{4}$/))
    .filter(x => !x.match(/^stringParam_[0-9a-z]{4}$/))
    .filter(x => !x.match(/^booleanParam_[0-9a-z]{4}$/))
    .toSorted()

export default Object.fromEntries(
    new Set(res)
        .values()
        .map(x => [x, []])
)
