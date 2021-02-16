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

----

## CLI App

The app ( [cli/mod.ts](./cli/mod.ts) ) accepts path data from stdin. 

Example:

`> echo "M 60 50 z" | deno run cli/mod.ts -w 100 -h 100 --terse`

Output: 

`M.6.5z`

Supported flags:

| flag | default | description |
|-|-|-
|`--terse`| | eliminate unnecessary whitespaces and leading zeros.
|`--combine` | | eliminate unnecessary command letters.
|`--mulitline` | | separate commands by line feeds.
|`-t` | 4 | decimal places that numbers are truncated to.
|`-x` | 0 | transformation property ( see formula ) 
|`-y` | 0 | ditto.
|`-w` | 1 | ditto.
|`-h` | 1 | ditto.
|

Formula:

```
new coord x = ( old coord x - flag x ) / flag w
new coord y = ( old coord y - flag y ) / flag h
```
