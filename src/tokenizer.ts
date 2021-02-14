import { UnrecognizedErr } from "./error.ts";

/**
 * Command types.
 */
export type CmdTy =
  | "M"
  | "m"
  | "L"
  | "l"
  | "H"
  | "h"
  | "V"
  | "v"
  | "C"
  | "c"
  | "S"
  | "s"
  | "Q"
  | "q"
  | "T"
  | "t"
  | "A"
  | "a"
  | "Z"
  | "z";

export abstract class Tk {
  constructor(public pos: number) {}
  isCmd(): this is TkCmd {
    return false;
  }
  isSep(): this is TkSep {
    return false;
  }
  isNum(): this is TkNum {
    return false;
  }
  abstract clone(): Tk;
}

/**
 * Command token.
 */
export class TkCmd extends Tk {
  /**
   * Construct a command token.
   * @param pos Source position.
   * @param ty Command type.
   */
  constructor(pos: number, public ty: CmdTy) {
    super(pos);
  }
  isCmd(): this is TkCmd {
    return true;
  }
  clone() {
    return new TkCmd(this.pos, this.ty);
  }
  /**
   * Check if given letter is a command letter.
   * @param c A letter.
   */
  static isCmdTy(c: string): c is CmdTy {
    return /[MLHVCSQTAZ]/i.test(c);
  }
}

/**
 * Separator token.
 */
export class TkSep extends Tk {
  /**
   * Construct a separator token.
   * @param pos Source position
   * @param val Token value.
   */
  constructor(pos: number, private val: string) {
    super(pos);
  }
  isSep(): this is TkSep {
    return true;
  }
  clone() {
    return new TkSep(this.pos, this.val);
  }
  /** Check if token value has a comma */
  hasComma() {
    return this.commaAt() >= 0;
  }
  /** Find index of the comma in token value. */
  commaAt() {
    return this.val.indexOf(",");
  }
}

/**
 * Number token.
 */
export class TkNum extends Tk {
  constructor(pos: number, public val: string) {
    super(pos);
  }
  isNum(): this is TkNum {
    return true;
  }
  clone() {
    return new TkNum(this.pos, this.val);
  }
  /** Find index of dot in token value. */
  dotAt() {
    return this.val.indexOf(".");
  }
  /** Check if token value has a trailing dot. */
  hasTrailingDot() {
    return this.dotAt() === this.val.length - 1;
  }
}

/**
 * Generate tokens from path data.
 * @param d Path data.
 * @returns Array of tokens.
 * @throws UnregcognizedErr
 */
export function tokenize(d: string): Tk[] {
  const tks: Tk[] = [];
  const reSep = /(?:[\t\r\n ]+\,?|\,)[\t\r\n ]*/y;
  const reNum = /[+-]?(?:\d+\.\d+|\d+\.|\d+|\.\d+)(?:[eE][+-]?\d+)*/y;

  let i = 0;
  while (i < d.length) {
    reNum.lastIndex = i;
    const num = reNum.exec(d);
    if (num) {
      tks.push(new TkNum(i, num[0]));
      i = reNum.lastIndex;
      continue;
    }

    reSep.lastIndex = i;
    const sep = reSep.exec(d);
    if (sep) {
      tks.push(new TkSep(i, sep[0]));
      i = reSep.lastIndex;
      continue;
    }

    const c = d[i];
    if (TkCmd.isCmdTy(c)) {
      tks.push(new TkCmd(i, c));
      ++i;
      continue;
    }

    throw new UnrecognizedErr(d, i);
  }

  return tks;
}
