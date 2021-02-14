import { assertEquals, assertThrows } from "testing/asserts.ts";
import { UnrecognizedErr } from "./error.ts";
import { TkCmd, TkNum, TkSep, tokenize } from "./tokenizer.ts";

Deno.test("Tk: consecutive commas", () => {
  const tks = tokenize("M 0 , , 1");
  assertEquals(tks, [
    new TkCmd(0, "M"),
    new TkSep(1, " "),
    new TkNum(2, "0"),
    new TkSep(3, " , "),
    new TkSep(6, ", "),
    new TkNum(8, "1"),
  ]);
});

Deno.test("Tk: is*()", () => {
  const tks = tokenize("M 0 0");
  assertEquals(tks[0].isCmd(), true);
  assertEquals(tks[1].isSep(), true);
  assertEquals(tks[2].isNum(), true);
});

Deno.test("Tk: separator token has comma", () => {
  const tks = tokenize("M 0,0");
  const tk = tks[3];
  if (tk.isSep()) {
    assertEquals(tk.hasComma(), true);
  }
});

Deno.test("Tk: clone", () => {
  const tks = tokenize("M 0, 0");
  assertEquals(tks[0].clone(), tks[0]);
});

Deno.test("Tk: num w/ exponent", () => {
  const tks = tokenize("M 1e2 1e+2");
  assertEquals(tks, [
    new TkCmd(0, "M"),
    new TkSep(1, " "),
    new TkNum(2, "1e2"),
    new TkSep(5, " "),
    new TkNum(6, "1e+2"),
  ]);
});

Deno.test("Tk: num with dot and exponent", () => {
  const tks = tokenize("M .1e2 1.e2");
  assertEquals(tks, [
    new TkCmd(0, "M"),
    new TkSep(1, " "),
    new TkNum(2, ".1e2"),
    new TkSep(6, " "),
    new TkNum(7, "1.e2"),
  ]);
});

Deno.test("Tk: unrecognized content", () => {
  assertThrows(
    () => {
      tokenize("M 0;0");
    },
    UnrecognizedErr,
  );
});
