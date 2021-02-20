import { generate, parse } from "../src/mod.ts";

const segs = parse("M0,1L2-3h0.1e1v0.6666z");
const d = generate(segs, { multiline: true, combine: true, truncate: 2 });
console.log(d);

// Output:
// M 0 1 2 -3
// h 1
// v 0.66
// z
