import { assertEquals, assertThrows } from "testing/asserts.ts";
import { TkCmd, TkNum, TkSep } from "./tokenizer.ts";
import { analyze } from "./lexer.ts";
import {
  BeginWithCommaErr,
  CmdFollowedByCommaErr,
  CmdFollowsCommaErr,
  ConsecutiveCommasErr,
  EndWithCommaErr,
  FlagIsNotZeroOrOneErr,
  NotBeginWithMoveToErr,
  NumIsNotParamErr,
  RadiusIsNegativeErr,
  TooFewParamsErr,
  TrailingDotErr,
  UnrecognizedErr,
} from "./error.ts";
import {} from "./seg.ts";

Deno.test("LexOpt: allowTrailingDot", () => {
  const d = "M 0. 1";
  const instrs = analyze(d, { allowTrailingDot: true });
  assertEquals(instrs, [
    [new TkCmd(0, "M"), [
      new TkNum(2, "0."),
      new TkNum(5, "1"),
    ]],
  ]);
  assertThrows(
    () => {
      analyze(d, { allowTrailingDot: false });
    },
    TrailingDotErr,
  );
});

Deno.test("LexOpt: allowNotBeginWithMoveTo", () => {
  const d = "H 1";
  const instrs = analyze(d, { allowNotBeginWithMoveTo: true });
  assertEquals(instrs, [
    [new TkCmd(0, "H"), [
      new TkNum(2, "1"),
    ]],
  ]);
  assertThrows(
    () => {
      analyze(d, { allowNotBeginWithMoveTo: false });
    },
    NotBeginWithMoveToErr,
  );
});

Deno.test("LexOpt: allowBeginWithComma (false)", () => {
  const d = ", M 0 0";
  assertThrows(
    () => {
      analyze(d, { allowBeginWithComma: false });
    },
    BeginWithCommaErr,
  );
});

Deno.test("LexOpt: allowBeginWithComma", () => {
  const d = ", M 0 0";
  assertThrows(
    () => {
      analyze(d, { allowBeginWithComma: true });
    },
    CmdFollowsCommaErr,
  );
});

Deno.test("LexOpt: allowEndWithComma (false)", () => {
  assertThrows(() => {
    const d = "M 0 0,";
    analyze(d, { allowEndWithComma: false });
  }, EndWithCommaErr);
});

Deno.test("LexOpt: allowEndWithComma", () => {
  const d = "M 0 0,";
  const instrs = analyze(d, { allowEndWithComma: true });
  assertEquals(instrs, [
    [new TkCmd(0, "M"), [
      new TkNum(2, "0"),
      new TkNum(4, "0"),
    ]],
  ]);
});

Deno.test("LexOpt: allowEndWithComma + allowCmdFollowedByComma", () => {
  const d = "M 0 0 Z,";
  const tks = analyze(d, {
    allowEndWithComma: true,
    allowCmdFollowedByComma: true,
  });
  assertEquals(tks, [
    [new TkCmd(0, "M"), [
      new TkNum(2, "0"),
      new TkNum(4, "0"),
    ]],
    [new TkCmd(6, "Z"), []],
  ]);
});

Deno.test("LexOpt: allowCmdFollowedByComma (false)", () => {
  assertThrows(() => {
    const d = "M, 0 0";
    analyze(d, { allowCmdFollowedByComma: false });
  }, CmdFollowedByCommaErr);
  assertThrows(() => {
    const d = "Z, 0 0";
    analyze(d, {
      allowCmdFollowedByComma: false,
      allowNotBeginWithMoveTo: true,
    });
  }, CmdFollowedByCommaErr);
});

Deno.test("LexOpt: allowCmdFollowedByComma", () => {
  const d = "M, 0 0";
  const instrs = analyze(d, { allowCmdFollowedByComma: true });
  assertEquals(instrs, [
    [
      new TkCmd(0, "M"),
      [
        new TkNum(3, "0"),
        new TkNum(5, "0"),
      ],
    ],
  ]);
});

Deno.test("LexOpt: allowCmdFollowsComma", () => {
  const d = "M 0 0, H 1";
  assertThrows(
    () => {
      analyze(d, { allowCmdFollowsComma: false });
    },
    CmdFollowsCommaErr,
  );
  const instrs = analyze(d, { allowCmdFollowsComma: true });
  assertEquals(instrs, [
    [
      new TkCmd(0, "M"),
      [
        new TkNum(2, "0"),
        new TkNum(4, "0"),
      ],
    ],
    [
      new TkCmd(7, "H"),
      [
        new TkNum(9, "1"),
      ],
    ],
  ]);
});

Deno.test("LexOpt: allowRadiusIsNegative", () => {
  assertThrows(
    () => {
      analyze("M 0 0 A -1 0 0 0 0 0 0", { allowRadiusIsNegative: false });
    },
    RadiusIsNegativeErr,
  );

  assertThrows(
    () => {
      analyze("M 0 0 A 0 -1 0 0 0 0 0", { allowRadiusIsNegative: false });
    },
    RadiusIsNegativeErr,
  );

  const tks = analyze("M 0 0 A -1 0 0 0 0 0 0", {
    allowRadiusIsNegative: true,
  });
  assertEquals(tks, [
    [new TkCmd(0, "M"), [
      new TkNum(2, "0"),
      new TkNum(4, "0"),
    ]],
    [new TkCmd(6, "A"), [
      new TkNum(8, "-1"),
      new TkNum(11, "0"),
      new TkNum(13, "0"),
      new TkNum(15, "0"),
      new TkNum(17, "0"),
      new TkNum(19, "0"),
      new TkNum(21, "0"),
    ]],
  ]);
});

//
// Must be lex err.
//

Deno.test("LexErr: unregconized", () => {
  assertThrows(
    () => {
      analyze("M 0 0 ; L 1 1");
    },
    UnrecognizedErr,
  );
});

Deno.test("LexErr: consecutive commas", () => {
  assertThrows(
    () => {
      analyze("M 0,,0");
    },
    ConsecutiveCommasErr,
  );

  assertThrows(
    () => {
      analyze(",, M 0 0", { allowBeginWithComma: true });
    },
    ConsecutiveCommasErr,
  );

  const tks = analyze("M 0,0");
  assertEquals(tks, [
    [new TkCmd(0, "M"), [
      new TkNum(2, "0"),
      new TkNum(4, "0"),
    ]],
  ]);
});

Deno.test("LexErr: too few params", () => {
  assertThrows(
    () => {
      analyze("M 0");
    },
    TooFewParamsErr,
  );
});

Deno.test("LexErr: num is not param", () => {
  assertThrows(
    () => {
      analyze("M 0 0 Z 1");
    },
    NumIsNotParamErr,
  );
});

Deno.test("LexErr: flag is not '0' or '1'", () => {
  assertThrows(
    () => {
      analyze("M 0 0 A 0 0 0 3 0 0 0");
    },
    FlagIsNotZeroOrOneErr,
  );

  assertThrows(
    () => {
      analyze("M 0 0 A 0 0 0 0 2 0 0");
    },
    FlagIsNotZeroOrOneErr,
  );
});

//
// Should pass
//

Deno.test("syn: n dot n", () => {
  const instrs = analyze("M 0 0.1");
  assertEquals(instrs, [
    [new TkCmd(0, "M"), [
      new TkNum(2, "0"),
      new TkNum(4, "0.1"),
    ]],
  ]);
});

Deno.test("syn: dot n", () => {
  const instrs = analyze("M 0 .1");
  assertEquals(instrs, [
    [new TkCmd(0, "M"), [
      new TkNum(2, "0"),
      new TkNum(4, ".1"),
    ]],
  ]);
});

Deno.test("syn: n dot", () => {
  const instrs = analyze("M 0 1.", { allowTrailingDot: true });
  assertEquals(instrs, [
    [new TkCmd(0, "M"), [
      new TkNum(2, "0"),
      new TkNum(4, "1."),
    ]],
  ]);
});

Deno.test("syn: n dot n dot n", () => {
  const instrs = analyze("M 0.0.1");
  assertEquals(instrs, [
    [new TkCmd(0, "M"), [
      new TkNum(2, "0.0"),
      new TkNum(5, ".1"),
    ]],
  ]);
});

Deno.test("syn: sign", () => {
  const instrs = analyze("M -1 +1");
  assertEquals(instrs, [
    [new TkCmd(0, "M"), [
      new TkNum(2, "-1"),
      new TkNum(5, "+1"),
    ]],
  ]);
});

Deno.test("syn: exponent", () => {
  const instrs = analyze("M 0 0.1e1");
  assertEquals(instrs, [
    [new TkCmd(0, "M"), [
      new TkNum(2, "0"),
      new TkNum(4, "0.1e1"),
    ]],
  ]);
});

Deno.test("syn: exponent sign", () => {
  const instrs = analyze("M 10e-1 0.1e+1");
  assertEquals(instrs, [
    [new TkCmd(0, "M"), [
      new TkNum(2, "10e-1"),
      new TkNum(8, "0.1e+1"),
    ]],
  ]);
});

Deno.test("syn: leading / trailing wsp", () => {
  const instrs = analyze(" M 0 0 ");
  assertEquals(instrs, [
    [new TkCmd(1, "M"), [
      new TkNum(3, "0"),
      new TkNum(5, "0"),
    ]],
  ]);
});

Deno.test("syn: cmd followed by num", () => {
  const instrs = analyze("M0 0");
  assertEquals(instrs, [
    [new TkCmd(0, "M"), [
      new TkNum(1, "0"),
      new TkNum(3, "0"),
    ]],
  ]);
});

Deno.test("syn: comma-sep params", () => {
  const instrs = analyze("M 0 , 0");
  assertEquals(instrs, [
    [new TkCmd(0, "M"), [
      new TkNum(2, "0"),
      new TkNum(6, "0"),
    ]],
  ]);
});

Deno.test("syn: combined params", () => {
  const instrs = analyze("M 0 0 1 1");
  assertEquals(instrs, [
    [new TkCmd(0, "M"), [
      new TkNum(2, "0"),
      new TkNum(4, "0"),
      new TkNum(6, "1"),
      new TkNum(8, "1"),
    ]],
  ]);
});

Deno.test("syn: integer part w/ leading 0s", () => {
  const tks = analyze("M 0 00010");
  assertEquals(tks, [
    [new TkCmd(0, "M"), [
      new TkNum(2, "0"),
      new TkNum(4, "00010"),
    ]],
  ]);
});

Deno.test("syn: exponent w/ leading 0s", () => {
  const tks = analyze("M 0 0.1e+0001");
  assertEquals(tks, [
    [new TkCmd(0, "M"), [
      new TkNum(2, "0"),
      new TkNum(4, "0.1e+0001"),
    ]],
  ]);
});
