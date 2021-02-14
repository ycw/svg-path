import { assertEquals } from "testing/asserts.ts";
import { parse } from "./parser.ts";
import {
  SegA,
  SegC,
  SegH,
  SegL,
  SegM,
  SegQ,
  SegS,
  SegT,
  SegV,
  SegZ,
} from "./seg.ts";

Deno.test("parse: path data w/ all available cmds", () => {
  const d = `M 0 0 
  L 0 0 H 0 V 0 
  C 0 0 0 0 0 0 S 0 0 0 0
  Q 0 0 0 0 T 0 0
  A 1 2 3 0 0 4 5
  Z
  `;
  const segs = parse(d);
  assertEquals(segs, [
    new SegM("M", [0, 0]),
    new SegL("L", [0, 0]),
    new SegH("H", [0]),
    new SegV("V", [0]),
    new SegC("C", [0, 0, 0, 0, 0, 0]),
    new SegS("S", [0, 0, 0, 0]),
    new SegQ("Q", [0, 0, 0, 0]),
    new SegT("T", [0, 0]),
    new SegA("A", [1, 2, 3, false, false, 4, 5]),
    new SegZ("Z"),
  ]);
});
