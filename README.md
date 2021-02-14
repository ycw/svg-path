# svg-path

SVG path data toolset written in typescript running on [deno](https://github.com/denoland/deno). 

Parser complies with SVG 1.1 [grammer](https://www.w3.org/TR/SVG11/paths.html#PathDataBNF).

Test coverage 💯%.

## Parser

Usage: [ex/validate.ts](../ex/validate.ts)

Supported options: `> deno doc src/mod.ts LexOpt`


## Error Handling

Usage: [ex/triage.ts](../ex/triage.ts)

Supported error assertions: `> deno doc src/mod.ts LexErr`


## Transformer

Usage: [ex/transform.ts](../ex/transform.ts)

Supported segment assertions: `> deno doc src/mod.ts Seg`


## Generator

Usage: [ex/codegen.ts](../ex/codegen.ts)

Supported options: `> deno doc src/mod.ts GenOpt`
