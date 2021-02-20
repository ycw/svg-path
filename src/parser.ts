import { analyze, LexOpt } from "./lexer.ts";
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

/**
 * Convert path data into path segments. 
 * @param d Path data.
 * @param opt Lexer options.
 * @returns Array of path segments.
 * @throws `LexErr`
 */
export function parse(d: string, opt?: LexOpt): Seg[] {
  const instrs = analyze(d, opt);

  const segs: Seg[] = [];
  let i = 0;
  while (i < instrs.length) {
    const [cmd, nums] = instrs[i];
    switch (cmd.ty) {
      case "H":
      case "h":
        for (let j = 0; j < nums.length; ++j) {
          segs.push(new SegH(cmd.ty, [parseFloat(nums[j].val)]));
        }
        break;
      case "V":
      case "v":
        for (let j = 0; j < nums.length; ++j) {
          segs.push(new SegV(cmd.ty, [parseFloat(nums[j].val)]));
        }
        break;
      case "M":
      case "m":
        segs.push(
          new SegM(cmd.ty, [
            parseFloat(nums[0].val),
            parseFloat(nums[1].val),
          ]),
        );
        for (let j = 2; j < nums.length; j += 2) {
          segs.push(
            new SegL(
              cmd.ty === "M" ? "L" : "l",
              [
                parseFloat(nums[j].val),
                parseFloat(nums[j + 1].val),
              ],
            ),
          );
        }
        break;
      case "L":
      case "l":
        for (let j = 0; j < nums.length; j += 2) {
          segs.push(
            new SegL(cmd.ty, [
              parseFloat(nums[j].val),
              parseFloat(nums[j + 1].val),
            ]),
          );
        }
        break;
      case "T":
      case "t":
        for (let j = 0; j < nums.length; j += 2) {
          segs.push(
            new SegT(cmd.ty, [
              parseFloat(nums[j].val),
              parseFloat(nums[j + 1].val),
            ]),
          );
        }
        break;
      case "Q":
      case "q":
        for (let j = 0; j < nums.length; j += 4) {
          segs.push(
            new SegQ(cmd.ty, [
              parseFloat(nums[j].val),
              parseFloat(nums[j + 1].val),
              parseFloat(nums[j + 2].val),
              parseFloat(nums[j + 3].val),
            ]),
          );
        }
        break;
      case "S":
      case "s":
        for (let j = 0; j < nums.length; j += 4) {
          segs.push(
            new SegS(cmd.ty, [
              parseFloat(nums[j].val),
              parseFloat(nums[j + 1].val),
              parseFloat(nums[j + 2].val),
              parseFloat(nums[j + 3].val),
            ]),
          );
        }
        break;
      case "C":
      case "c":
        for (let j = 0; j < nums.length; j += 6) {
          segs.push(
            new SegC(cmd.ty, [
              parseFloat(nums[j].val),
              parseFloat(nums[j + 1].val),
              parseFloat(nums[j + 2].val),
              parseFloat(nums[j + 3].val),
              parseFloat(nums[j + 4].val),
              parseFloat(nums[j + 5].val),
            ]),
          );
        }
        break;
      case "A":
      case "a":
        for (let j = 0; j < nums.length; j += 7) {
          segs.push(
            new SegA(cmd.ty, [
              parseFloat(nums[j].val),
              parseFloat(nums[j + 1].val),
              parseFloat(nums[j + 2].val),
              nums[j + 3].val === "1",
              nums[j + 4].val === "1",
              parseFloat(nums[j + 5].val),
              parseFloat(nums[j + 6].val),
            ]),
          );
        }
        break;
      case "Z":
      case "z": {
        segs.push(new SegZ(cmd.ty));
        break;
      }
    }
    ++i;
  }
  return segs;
}
