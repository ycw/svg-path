import { Seg } from "./seg.ts";

/**
 * Generator options.
 */
export interface GenOpt {
  /** 
   * Separate commands by '\n'.
   * @default false 
   * */
  multiline?: boolean;
  /** 
   * Decimal places that a number is truncated to. 
   * @default 4
   */
  truncate?: number;
  /**
   * Combine unnecessary commands.
   * @default false
   */
  combine?: boolean;
  /**
   * Eliminate unnecessary whitespaces and leading zeros. 
   * @default false
   */
  terse?: boolean;
}

const defOpt: Required<GenOpt> = {
  truncate: Number.NaN,
  multiline: false,
  combine: false,
  terse: false,
};

/**
 * Generate path data ( string ) from path segments ( `Seg[]` ).
 * @param segs Path segments. ( parser's output )
 * @param opt Options.
 * @returns Path data
 */
export function generate(segs: Seg[], opt: GenOpt = {}): string {
  const cfg: Required<GenOpt> = { ...defOpt, ...opt };

  // truncate a number to desired decimal places
  const trunc = (n: number) => {
    const s = n.toString();
    const i = s.indexOf(".");
    return i < 0 ? s : s.substring(0, i + cfg.truncate + 1);
  };

  // reducer - params to string
  const toStr = (s: string[], x: number, i: number) => {
    const s0 = Number.isNaN(cfg.truncate) ? x.toString() : trunc(x);
    if (cfg.terse) {
      const s1 = s0.replace(/^0\./, ".");
      if (i === 0) { // no wsp precedes 1st param.
        s.push(s1);
      } else if (s1.startsWith("-")) { // "M0.6-5"
        s.push(s1);
      } else if (s1.startsWith(".") && ~s[i - 1].indexOf(".")) { // "M.6.5"
        s.push(s1);
      } else { // ex. "M6 .5" a wsp is required.
        s.push(" ", s1);
      }
    } else {
      if (i === 0) {
        s.push(s0);
      } else {
        s.push(" ", s0);
      }
    }
    return s;
  };

  const str = [];
  let cmd: Seg | undefined; // prev cmd seg.
  let strs: string[] = []; // prev stringified params.

  for (const seg of segs) {
    let combined = false;
    if (cfg.combine) {
      // push cmd letter only if not combine-able
      // where combine-able = eq(cmds) || (M-L) || (m-l)
      if (cmd === undefined) {
        str.push(seg.cmd);
      } else {
        if (
          cmd.isCmdEq(seg) ||
          (cmd.isAbs() && cmd.isM() && seg.isAbs() && seg.isL()) ||
          (cmd.isRel() && cmd.isM() && seg.isRel() && seg.isL())
        ) {
          combined = true;
        } else {
          str.push(cfg.multiline ? "\n" : cfg.terse ? "" : " ");
          str.push(seg.cmd);
        }
      }
    } else {
      if (cmd === undefined) {
        str.push(seg.cmd);
      } else {
        str.push(cfg.multiline ? "\n" : cfg.terse ? "" : " ");
        str.push(seg.cmd);
      }
    }

    cmd = seg;

    // ----
    // push numbers
    // ----

    if (seg.isZ()) {
      strs.length = 0;
      continue;
    }

    let s: string[] = [];

    if (seg.isH()) {
      s = [seg.x].reduce(toStr, s);
    } else if (seg.isV()) {
      s = [seg.y].reduce(toStr, s);
    } else if (seg.isM() || seg.isL() || seg.isT()) {
      s = [seg.x, seg.y].reduce(toStr, s);
    } else if (seg.isQ()) {
      s = [seg.x1, seg.y1, seg.x, seg.y].reduce(toStr, s);
    } else if (seg.isS()) {
      s = [seg.x2, seg.y2, seg.x, seg.y].reduce(toStr, s);
    } else if (seg.isC()) {
      s = [seg.x1, seg.x2, seg.x2, seg.y2, seg.x, seg.y].reduce(toStr, s);
    } else if (seg.isA()) {
      s = [
        seg.rx,
        seg.ry,
        seg.xAxisRotation,
        seg.largeArcFlag ? 1 : 0,
        seg.sweepFlag ? 1 : 0,
        seg.x,
        seg.y,
      ].reduce(toStr, s);
    }

    // push "stringified params"
    if (
      cfg.terse &&
      (!combined ||
        (combined && s[0].startsWith(".") &&
          ~strs[strs.length - 1]?.indexOf(".")))
    ) {
      str.push(s.join(""));
    } else {
      str.push(" ", s.join(""));
    }

    // update
    strs = s;
  }
  return str.join("");
}
