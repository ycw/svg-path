import { parse } from "../src/mod.ts";

try {
  parse("M 1. 2. z", { allowTrailingDot: true });
  console.log("ok");
} catch {
  console.log("not ok");
}

// Output:
// ok
