export type Literal = string | number

export type Block = [
    blockName: string,
    ...args: (Literal | Block | Block[])[],
]

export interface Folder {
    name: string
    children: Folder[]
    blocks: Block[]
}

export const Block =
(blockName: string, ...args: (Literal | Block | Block[])[]): Block => [
    blockName,
    ...args,
]

export const Folder =
(
    name: string,
    children: Folder[],
    blocks: Block[] = [],
): Folder => ({
    name,
    children,
    blocks,
})
