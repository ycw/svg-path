import { parse } from "../src/parser.ts";
import { LexErr } from "../src/error.ts";

try {
  parse(`M 1. 0`);
} catch (e) {
  if (e instanceof LexErr) {
    if (e.isTrailingDot()) {
      console.log(e.constructor.name, e.line, e.col, e.pos);
    }
  }
}

// Output:
// TrailingDotErr 1 3 3
