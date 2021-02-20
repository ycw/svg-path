# About

A toolset helps manipulate SVG 1.1 [path](https://www.w3.org/TR/SVG11/paths.html#PathDataBNF) data. 

## Usage
 
### Parser

[Example](./ex/validate.ts) 
| [Docs](https://doc.deno.land/https/raw.githubusercontent.com/ycw/svg-path/main/src/mod.ts#parse) 
| [Options](https://doc.deno.land/https/raw.githubusercontent.com/ycw/svg-path/main/src/mod.ts#LexOpt)


### Error Handling

[Example](./ex/triage.ts) 
| [Docs](https://doc.deno.land/https/raw.githubusercontent.com/ycw/svg-path/main/src/mod.ts#LexErr)



### Transformer

[Example](./ex/transform.ts)
| [Docs](https://doc.deno.land/https/raw.githubusercontent.com/ycw/svg-path/main/src/mod.ts#transform)


### Generator

[Example](./ex/codegen.ts)
| [Docs](https://doc.deno.land/https/raw.githubusercontent.com/ycw/svg-path/main/src/mod.ts#generate)
| [Options](https://doc.deno.land/https/raw.githubusercontent.com/ycw/svg-path/main/src/mod.ts#GenOpt)


## CLI 

Installation:

`$ deno install -n svg-path https://raw.githubusercontent.com/ycw/svg-path/main/cli/mod.ts`

Example:

`$ echo "M 60 50 z" | svg-path -w 100 -h 100 --terse`

Output: 

`M.6.5z`

Available flags:

| Flag | Default | Description |
|-|-|-
|`--terse`| | Eliminate unnecessary whitespaces and leading zeros.
|`--combine` | | Eliminate unnecessary command letters.
|`--mulitline` | | Separate commands by line feeds.
|`-t` | 4 | Decimal places that a decimal number is truncated to.
|`-x` | 0 | Transformation frame's x.
|`-y` | 0 | Transformation frame's y.
|`-w` | 1 | Transformation frame's signed width. 
|`-h` | 1 | Transformation frame's signed height.
