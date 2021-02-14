# svg-path

SVG path data toolset written in typescript running on [deno](https://github.com/denoland/deno). 

Parser complies with SVG 1.1 [grammer](https://www.w3.org/TR/SVG11/paths.html#PathDataBNF).

Test coverage 💯%.

## Parser

[ex/validate.ts](./ex/validate.ts)

Supported options: `> deno doc src/mod.ts LexOpt`


## Error Handling

[ex/triage.ts](./ex/triage.ts)

Supported error assertions: `> deno doc src/mod.ts LexErr`


## Transformer

[ex/transform.ts](./ex/transform.ts)

Supported segment assertions: `> deno doc src/mod.ts Seg`


## Generator

[ex/codegen.ts](./ex/codegen.ts)

Supported options: `> deno doc src/mod.ts GenOpt`
