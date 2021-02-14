import { assert, assertEquals, assertNotEquals } from "testing/asserts.ts";
import {
  BeginWithCommaErr,
  CmdFollowedByCommaErr,
  CmdFollowsCommaErr,
  ConsecutiveCommasErr,
  EndWithCommaErr,
  FlagIsNotZeroOrOneErr,
  LexErr,
  NotBeginWithMoveToErr,
  NumIsNotParamErr,
  RadiusIsNegativeErr,
  TooFewParamsErr,
  TrailingDotErr,
  UnrecognizedErr,
} from "./error.ts";

Deno.test("error: line, col and pos.", () => {
  const d = `
M 0 0
L 1 1;
z
`;
  const e = new UnrecognizedErr(d, 12);
  assertEquals(e.line, 3);
  assertEquals(e.col, 5);
  assertEquals(e.pos, 12);
});

Deno.test("error: LexErr is*()", () => {
  assert(new UnrecognizedErr("", 0).isUnrecognized());
  assert(new TrailingDotErr("", 0).isTrailingDot());
  assert(new BeginWithCommaErr("", 0).isBeginWithComma());
  assert(new CmdFollowedByCommaErr("", 0).isCmdFollowedByComma());
  assert(new CmdFollowsCommaErr("", 0).isCmdFollowsComma());
  assert(new ConsecutiveCommasErr("", 0).isConsecutiveCommas());
  assert(new EndWithCommaErr("", 0).isEndWithComma());
  assert(new FlagIsNotZeroOrOneErr("", 0).isFlagIsNotZeroOrOne());
  assert(new NotBeginWithMoveToErr("", 0).isNotBeginWithMoveTo());
  assert(new NumIsNotParamErr("", 0).isNumIsNotParam());
  assert(new RadiusIsNegativeErr("", 0).isRadiusIsNegative());
  assert(new TooFewParamsErr("", 0).isTooFewParams());
});

Deno.test("error: extends LexErr", () => {
  class E extends LexErr {}
  const err = new E("", 0);
  assertEquals(err.isBeginWithComma(), false);
  assertEquals(err.isCmdFollowedByComma(), false);
  assertEquals(err.isCmdFollowsComma(), false);
  assertEquals(err.isConsecutiveCommas(), false);
  assertEquals(err.isEndWithComma(), false);
  assertEquals(err.isFlagIsNotZeroOrOne(), false);
  assertEquals(err.isNotBeginWithMoveTo(), false);
  assertEquals(err.isNumIsNotParam(), false);
  assertEquals(err.isRadiusIsNegative(), false);
  assertEquals(err.isTooFewParams(), false);
  assertEquals(err.isTrailingDot(), false);
  assertEquals(err.isUnrecognized(), false);
});
