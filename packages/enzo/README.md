# enzo
Zod schema for .ent

## Why Zod over TS?
- `ts-to-zod` 은근 번거로움
    - `import` 잘 안됨
- TS에서는 못하는 표현 가능
    - stringified json
    - ranged number
- 필요한 부분만 zod로 작성하고 나머진 `ts-to-zod`로 변환할수도 있겠지만 그게 더 귀찮을듯..
