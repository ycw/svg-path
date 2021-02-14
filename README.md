# svg-path

SVG path data toolset written in typescript running on [deno](https://github.com/denoland/deno). 

Parser complies with SVG 1.1 [grammer](https://www.w3.org/TR/SVG11/paths.html#PathDataBNF).

Test coverage 💯%.

## Parser

Usage: [ex/validate.ts](https://github.com/ycw/svg-path/ex/validate.ts)

Supported options: `> deno doc src/mod.ts LexOpt`


## Error Handling

Usage: [ex/triage.ts](https://github.com/ycw/svg-path/ex/triage.ts)

Supported error assertions: `> deno doc src/mod.ts LexErr`


## Transformer

Usage: [ex/transform.ts](https://github.com/ycw/svg-path/ex/transform.ts)

Supported segment assertions: `> deno doc src/mod.ts Seg`


## Generator

Usage: [ex/codegen.ts](https://github.com/ycw/svg-path/ex/codegen.ts)

Supported options: `> deno doc src/mod.ts GenOpt`
