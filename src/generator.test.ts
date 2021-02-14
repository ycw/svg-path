import { assertEquals } from "testing/asserts.ts";
import { generate } from "./generator.ts";
import { parse } from "./parser.ts";

Deno.test("GenOpt: multiline", () => {
  const segs = parse("M 0 0 H 1");
  const s = generate(segs, { multiline: true });
  assertEquals(s, "M 0 0\nH 1");
});

Deno.test("GenOpt: truncate to n decimal places", () => {
  const segs = parse("M 3 0.56789");
  const s = generate(segs, { truncate: 3 });
  assertEquals(s, "M 3 0.567");
});

Deno.test("GenOpt: combine commands", () => {
  {
    const segs = parse("M 0 1 L 2 3");
    const s = generate(segs, { combine: true });
    assertEquals(s, "M 0 1 2 3");
  }
  {
    const segs = parse("m 0 1 l 2 3");
    const s = generate(segs, { combine: true });
    assertEquals(s, "m 0 1 2 3");
  }
  {
    const segs = parse("M 0 1 l 2 3");
    const s = generate(segs, { combine: true });
    assertEquals(s, "M 0 1 l 2 3");
  }
});

Deno.test("GenOpt: terse", () => {
  const segs = parse("M 0.1 0.2 H 0.3");
  const s = generate(segs, { terse: true });
  assertEquals(s, "M.1.2H.3");
});

Deno.test("GenOpt: terse + combine", () => {
  const segs = parse("M 0.1 0.2 L 0.3 1.4 +5 -6");
  const s = generate(segs, { terse: true, combine: true });
  assertEquals(s, "M.1.2.3 1.4 5-6");
});

Deno.test("gen: generate-parse cycle", () => {
  const d0 = "M0.1 .2L.3 0.4";
  const segs0 = parse(d0);
  const d1 = generate(segs0, { combine: true });
  const segs1 = parse(d1);
  const d2 = generate(segs1, { combine: true });
  assertEquals(d1, d2);
  assertEquals(d2, "M 0.1 0.2 0.3 0.4");
});

Deno.test("gen: path data w/ all available cmds", () => {
  const d = `
    M 0 0
    L 0 0
    H 0
    V 0
    C 0 0 0 0 0 0 
    S 0 0 0 0 
    Q 0 0 0 0
    T 0 0 
    A 0 0 0 0 0 0 0
    Z
  `;
  const d2 = generate(parse(d));
  assertEquals(
    d2,
"M 0 0\
 L 0 0 H 0 V 0 C 0 0 0 0 0 0 S 0 0 0 0\
 Q 0 0 0 0 T 0 0 A 0 0 0 0 0 0 0 Z",
  );
});
