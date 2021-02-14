# svg-path

SVG path data toolset written in typescript running on [deno](https://github.com/denoland/deno). 

Parser complies with SVG 1.1 [grammer](https://www.w3.org/TR/SVG11/paths.html#PathDataBNF).

Test coverage 💯%.

## Parser

Ex: `ex/validate.ts`

Supported options: `> deno doc src/mod.ts LexOpt`


## Error Handling

Ex: `ex/triage.ts`

Supported error assertions: `> deno doc src/mod.ts LexErr`


## Transformer

Ex: `ex/transform.ts`

Supported segment assertions: `> deno doc src/mod.ts Seg`


## Generator

Ex: `ex/codegen.ts`

Supported options: `> deno doc src/mod.ts GenOpt`
