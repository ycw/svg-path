import { TkCmd, TkNum, tokenize } from "./tokenizer.ts";
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
} from "./error.ts";

/**
 * Parameter count of commands.
 */
const paramSz = new Map([
  ["M", 2],
  ["L", 2],
  ["H", 1],
  ["V", 1],
  ["C", 6],
  ["S", 4],
  ["Q", 4],
  ["T", 2],
  ["A", 7],
]);

/**
 * Lexer options.
 */
export interface LexOpt {
  /**
   * Allow path data not begins with command m / M.
   * @default false
   */
  allowNotBeginWithMoveTo?: boolean;
  /**
   * Allow arc command's rx and ry to be negative.
   * @default false
   */
  allowRadiusIsNegative?: boolean;
  /**
   * Allow numbers having trailing dot, ex. `M 0. 0. z`
   * @default false
   */
  allowTrailingDot?: boolean;
  /**
   * Allow path data begins with comma. `,M 0 0 z`
   * @default false
   */
  allowBeginWithComma?: boolean;
  /**
   * Allow path data ends with comma. ex. `M 0 0 z,`
   * @default false
   */
  allowEndWithComma?: boolean;
  /**
   * Allow command letter followed by comma, ex. `M, 0 0 z`
   * @default false
   */
  allowCmdFollowedByComma?: boolean;
  /**
   * Allow command letter follows comma, ex. `M 0 0, z`
   * @default false
   */
  allowCmdFollowsComma?: boolean;
}

/**
 * Default lexer options.
 */
const defOpt: Required<LexOpt> = {
  allowTrailingDot: false,
  allowNotBeginWithMoveTo: false,
  allowBeginWithComma: false,
  allowEndWithComma: false,
  allowCmdFollowedByComma: false,
  allowCmdFollowsComma: false,
  allowRadiusIsNegative: false,
};

/**
 * Instruction.
 */
export type Instr = [TkCmd, TkNum[]];

/**
 * Check grammer and re-group tokens.
 * @param d Path data.
 * @param opt Lexer options.
 * @returns Array of instructions.
 * @throws LexErr
 */
export function analyze(d: string, opt: LexOpt = defOpt): Instr[] {
  const tks = tokenize(d);
  const instrs: Instr[] = [];

  let i = 0;
  let firstCmd: TkCmd | undefined;
  while (i < tks.length) {
    const tk = tks[i];
    if (tk.isNum()) {
      throw new NumIsNotParamErr(d, tk.pos);
    }
    if (tk.isSep()) {
      if (tk.hasComma()) {
        const prev = tks[i - 1];

        if (prev?.isSep() && prev.hasComma()) {
          throw new ConsecutiveCommasErr(d, tk.pos + tk.commaAt());
        }

        if (!opt.allowBeginWithComma) { // ", M 0 0"
          if (firstCmd === undefined) {
            throw new BeginWithCommaErr(d, tk.pos + tk.commaAt());
          }
        }

        if (!opt.allowCmdFollowsComma) { // "M 0 0 , L 0 0"
          const next = tks[i + 1];
          if (next?.isCmd()) {
            throw new CmdFollowsCommaErr(d, next.pos);
          }
        }

        if (!opt.allowCmdFollowedByComma) { // "M, 0 0" / "M 0 0 Z,"
          if (prev?.isCmd()) {
            throw new CmdFollowedByCommaErr(d, tk.pos + tk.commaAt());
          }
        }
      }
      ++i;
    }
    if (tk.isCmd()) {
      if (!opt.allowNotBeginWithMoveTo) {
        if (firstCmd === undefined) {
          if (tk.ty !== "M" && tk.ty !== "m") {
            throw new NotBeginWithMoveToErr(d, tk.pos);
          }
        }
      }
      firstCmd = tk;

      // ----
      // Enter parse instruction mode.
      // ----

      const instr: Instr = [tk.clone(), []];
      instrs.push(instr);
      ++i;

      // 'closepath' has no params, skip.
      if (tk.ty === "Z" || tk.ty === "z") {
        continue;
      }

      if (!opt.allowCmdFollowedByComma) {
        const next = tks[i];
        if (next?.isSep() && next.hasComma()) {
          throw new CmdFollowedByCommaErr(d, next.pos + next.commaAt());
        }
      }

      // ----
      // Enter pluck params mode.
      // ----

      while (i < tks.length) {
        const tk = tks[i].clone();
        if (tk.isNum()) {
          if (!opt.allowTrailingDot) {
            if (tk.hasTrailingDot()) {
              throw new TrailingDotErr(d, tk.pos + tk.dotAt());
            }
          }
          instr[1].push(tk);
          ++i;
        } else if (tk.isSep()) {
          { // consecutive commas
            const prev = tks[i - 1];
            if (prev.isSep() && prev.hasComma()) {
              throw new ConsecutiveCommasErr(d, tk.pos + tk.commaAt());
            }
          }
          ++i;
        } else if (tk.isCmd()) {
          if (tks[i - 1].isSep()) {
            --i;
          }
          break;
        }
      }

      // ----
      // Validate params
      // ---

      // validate params size
      const sz = paramSz.get(tk.ty.toUpperCase());
      if (sz) {
        if (instr[1].length === 0 || instr[1].length % sz) {
          throw new TooFewParamsErr(d, tk.pos);
        }
      }

      // validate arc cmd params
      if (tk.ty === "A" || tk.ty === "a") {
        let j = 0;
        const nums = instr[1];
        while (j < nums.length) {
          const rx = nums[j];
          if (!opt.allowRadiusIsNegative) {
            if (rx.val.startsWith("-")) {
              throw new RadiusIsNegativeErr(d, rx.pos);
            }
            const ry = nums[j + 1];
            if (ry.val.startsWith("-")) {
              throw new RadiusIsNegativeErr(d, ry.pos);
            }
          }
          const f0 = nums[j + 3];
          if (f0.val !== "0" && f0.val !== "1") {
            throw new FlagIsNotZeroOrOneErr(d, f0.pos);
          }
          const f1 = nums[j + 4];
          if (f1.val !== "0" && f1.val !== "1") {
            throw new FlagIsNotZeroOrOneErr(d, f1.pos);
          }
          j += 7;
        }
      }

      // ----
      // Final
      // ----

      // validate last token
      if (!opt.allowEndWithComma) {
        const last = tks[tks.length - 1];
        if (last.isSep() && last.hasComma()) {
          throw new EndWithCommaErr(d, last.pos + last.commaAt());
        }
      }
    }
  }
  return instrs;
}
