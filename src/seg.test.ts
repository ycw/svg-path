import {
  Seg,
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
import { assertEquals } from "testing/asserts.ts";
import { CmdTy } from "./tokenizer.ts";

Deno.test("seg: SegM", () => {
  const seg = new SegM("M", [0, 0]);
  const abs = new SegM("M", [0, 0]);
  const rel = new SegM("m", [0, 0]);
  assertEquals(seg.isM(), true);
  assertEquals(seg.isAbs(), true);
  assertEquals(seg.isRel(), false);
  assertEquals(seg.clone(), seg);
  assertEquals(seg.clone().isCmdEq(seg), true);
  seg.toRel(0, 0);
  assertEquals(seg, rel);
  seg.toAbs(0, 0);
  assertEquals(seg, abs);
});

Deno.test("seg: SegL", () => {
  const seg = new SegL("L", [0, 0]);
  const abs = new SegL("L", [0, 0]);
  const rel = new SegL("l", [0, 0]);
  assertEquals(seg.isL(), true);
  assertEquals(seg.isAbs(), true);
  assertEquals(seg.isRel(), false);
  assertEquals(seg.clone(), seg);
  assertEquals(seg.clone().isCmdEq(seg), true);
  seg.toRel(0, 0);
  assertEquals(seg, rel);
  seg.toAbs(0, 0);
  assertEquals(seg, abs);
});

Deno.test("seg: SegH", () => {
  const seg = new SegH("H", [0]);
  const abs = new SegH("H", [0]);
  const rel = new SegH("h", [0]);
  assertEquals(seg.isH(), true);
  assertEquals(seg.isAbs(), true);
  assertEquals(seg.isRel(), false);
  assertEquals(seg.clone(), seg);
  assertEquals(seg.clone().isCmdEq(seg), true);
  seg.toRel(0, 0);
  assertEquals(seg, rel);
  seg.toAbs(0, 0);
  assertEquals(seg, abs);
});

Deno.test("seg: SegV", () => {
  const seg = new SegV("V", [0]);
  const abs = new SegV("V", [0]);
  const rel = new SegV("v", [0]);
  assertEquals(seg.isV(), true);
  assertEquals(seg.isAbs(), true);
  assertEquals(seg.isRel(), false);
  assertEquals(seg.clone(), seg);
  assertEquals(seg.clone().isCmdEq(seg), true);
  seg.toRel(0, 0);
  assertEquals(seg, rel);
  seg.toAbs(0, 0);
  assertEquals(seg, abs);
});

Deno.test("seg: SegC", () => {
  const seg = new SegC("C", [0, 0, 0, 0, 0, 0]);
  const abs = new SegC("C", [0, 0, 0, 0, 0, 0]);
  const rel = new SegC("c", [0, 0, 0, 0, 0, 0]);
  assertEquals(seg.isC(), true);
  assertEquals(seg.isAbs(), true);
  assertEquals(seg.isRel(), false);
  assertEquals(seg.clone(), seg);
  assertEquals(seg.clone().isCmdEq(seg), true);
  seg.toRel(0, 0);
  assertEquals(seg, rel);
  seg.toAbs(0, 0);
  assertEquals(seg, abs);
});

Deno.test("seg: SegS", () => {
  const seg = new SegS("S", [0, 0, 0, 0]);
  const abs = new SegS("S", [0, 0, 0, 0]);
  const rel = new SegS("s", [0, 0, 0, 0]);
  assertEquals(seg.isS(), true);
  assertEquals(seg.isAbs(), true);
  assertEquals(seg.isRel(), false);
  assertEquals(seg.clone(), seg);
  assertEquals(seg.clone().isCmdEq(seg), true);
  seg.toRel(0, 0);
  assertEquals(seg, rel);
  seg.toAbs(0, 0);
  assertEquals(seg, abs);
});

Deno.test("seg: SegQ", () => {
  const seg = new SegQ("Q", [0, 0, 0, 0]);
  const abs = new SegQ("Q", [0, 0, 0, 0]);
  const rel = new SegQ("q", [0, 0, 0, 0]);
  assertEquals(seg.isQ(), true);
  assertEquals(seg.isAbs(), true);
  assertEquals(seg.isRel(), false);
  assertEquals(seg.clone(), seg);
  assertEquals(seg.clone().isCmdEq(seg), true);
  seg.toRel(0, 0);
  assertEquals(seg, rel);
  seg.toAbs(0, 0);
  assertEquals(seg, abs);
});

Deno.test("seg: SegT", () => {
  const seg = new SegT("T", [0, 0]);
  const abs = new SegT("T", [0, 0]);
  const rel = new SegT("t", [0, 0]);
  assertEquals(seg.isT(), true);
  assertEquals(seg.isAbs(), true);
  assertEquals(seg.isRel(), false);
  assertEquals(seg.clone(), seg);
  assertEquals(seg.clone().isCmdEq(seg), true);
  seg.toRel(0, 0);
  assertEquals(seg, rel);
  seg.toAbs(0, 0);
  assertEquals(seg, abs);
});

Deno.test("seg: SegA", () => {
  const seg = new SegA("A", [0, 0, 0, true, true, 0, 0]);
  const abs = new SegA("A", [0, 0, 0, true, true, 0, 0]);
  const rel = new SegA("a", [0, 0, 0, true, true, 0, 0]);
  assertEquals(seg.isA(), true);
  assertEquals(seg.isAbs(), true);
  assertEquals(seg.isRel(), false);
  assertEquals(seg.clone(), seg);
  assertEquals(seg.clone().isCmdEq(seg), true);
  seg.toRel(0, 0);
  assertEquals(seg, rel);
  seg.toAbs(0, 0);
  assertEquals(seg, abs);
  seg.rx = 10; // setter
  assertEquals(seg.rx, 10); // getter
  seg.ry = 10;
  assertEquals(seg.ry, 10);
  seg.xAxisRotation = 45;
  assertEquals(seg.xAxisRotation, 45);
  seg.largeArcFlag = false;
  assertEquals(seg.largeArcFlag, false);
  seg.sweepFlag = false;
  assertEquals(seg.sweepFlag, false);
});

Deno.test("seg: SegZ", () => {
  const seg = new SegZ("Z");
  const abs = new SegZ("Z");
  const rel = new SegZ("z");
  assertEquals(seg.isZ(), true);
  assertEquals(seg.isAbs(), true);
  assertEquals(seg.isRel(), false);
  assertEquals(seg.clone(), seg);
  assertEquals(seg.clone().isCmdEq(seg), true);
  seg.toRel(0, 0);
  assertEquals(seg, rel);
  seg.toAbs(0, 0);
  assertEquals(seg, abs);
});

Deno.test("seg: extends Seg", () => {
  class MySegS extends Seg {
    constructor(public cmd: CmdTy) {
      super();
    }
    isRel() {
      return true;
    }
    isAbs() {
      return true;
    }
    toRel() {}
    toAbs() {}
    clone() {
      return new MySegS(this.cmd);
    }
    isCmdEq() {
      return true;
    }
  }
  const s = new MySegS("S");
  assertEquals(s.isM(), false);
  assertEquals(s.isL(), false);
  assertEquals(s.isH(), false);
  assertEquals(s.isV(), false);
  assertEquals(s.isC(), false);
  assertEquals(s.isS(), false);
  assertEquals(s.isQ(), false);
  assertEquals(s.isT(), false);
  assertEquals(s.isA(), false);
  assertEquals(s.isZ(), false);
});
