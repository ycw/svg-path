import { parse } from "https://deno.land/std@0.87.0/flags/mod.ts";
import * as D from "../src/mod.ts";

//
// Defaults options.
//

const defOpt = {
  x: 0,
  y: 0,
  w: 1,
  h: 1,
  truncate: 4,
  multiline: false,
  combine: false,
  terse: false,
};

//
// Process args.
//

const opt = (() => {
  const { x, y, w, h, t, multiline, combine, terse } = parse(Deno.args);
  return {
    x: Number(x ?? defOpt.x),
    y: Number(y ?? defOpt.y),
    w: Number(w ?? defOpt.w),
    h: Number(h ?? defOpt.h),
    truncate: Number(t ?? defOpt.truncate),
    multiline: Boolean(multiline ?? defOpt.multiline),
    combine: Boolean(combine ?? defOpt.combine),
    terse: Boolean(terse ?? defOpt.terse),
  };
})();

//
// Read path data from stdin.
//

const data = new TextDecoder().decode(Deno.readAllSync(Deno.stdin));

//
// Parse path data.
//

const segs0 = (() => {
  try {
    return D.parse(data);
  } catch (e) {
    console.error(`${e.constructor.name}:${e.line}:${e.col}`);
    Deno.exit(1);
  }
})();

//
// Transform segments.
//

let segs1 = segs0;

if (opt.x != 0 || opt.y != 0 || opt.w != 1 || opt.h != 1) {
  //
  // Transform coords.
  //

  const fx = (x: number) => (x - opt.x) / opt.w;
  const fy = (y: number) => (y - opt.y) / opt.h;
  segs1 = D.transform(segs0, (seg) => {
    if (seg.isM() || seg.isL() || seg.isT()) {
      if (seg.isAbs()) {
        seg.x = fx(seg.x);
        seg.y = fy(seg.y);
      } else {
        seg.x /= opt.w;
        seg.y /= opt.h;
      }
    } else if (seg.isH()) {
      if (seg.isAbs()) {
        seg.x = fx(seg.x);
      } else {
        seg.x /= opt.w;
      }
    } else if (seg.isV()) {
      if (seg.isAbs()) {
        seg.y = fy(seg.y);
      } else {
        seg.y /= opt.h;
      }
    } else if (seg.isC()) {
      if (seg.isAbs()) {
        seg.x1 = fx(seg.x1);
        seg.y1 = fy(seg.y1);
        seg.x2 = fx(seg.x2);
        seg.y2 = fy(seg.y2);
        seg.x = fx(seg.x);
        seg.y = fy(seg.y);
      } else {
        seg.x1 /= opt.w;
        seg.y1 /= opt.h;
        seg.x2 /= opt.w;
        seg.y2 /= opt.h;
        seg.x /= opt.w;
        seg.y /= opt.h;
      }
    } else if (seg.isS()) {
      if (seg.isAbs()) {
        seg.x2 = fx(seg.x2);
        seg.y2 = fy(seg.y2);
        seg.x = fx(seg.x);
        seg.y = fy(seg.y);
      } else {
        seg.x2 /= opt.w;
        seg.y2 /= opt.h;
        seg.x /= opt.w;
        seg.y /= opt.h;
      }
    } else if (seg.isQ()) {
      if (seg.isAbs()) {
        seg.x1 = fx(seg.x1);
        seg.y1 = fy(seg.y1);
        seg.x = fx(seg.x);
        seg.y = fy(seg.y);
      } else {
        seg.x1 /= opt.w;
        seg.y1 /= opt.h;
        seg.x /= opt.w;
        seg.y /= opt.h;
      }
    } else if (seg.isA()) {
      if (seg.isAbs()) {
        seg.x = fx(seg.x);
        seg.y = fy(seg.y);
      } else {
        seg.x /= opt.w;
        seg.y /= opt.h;
      }
      seg.rx /= opt.w;
      seg.ry /= opt.h;
    }
    return seg;
  });
}

//
// Write path data to stdout.
//

console.log(
  D.generate(segs1, {
    multiline: opt.multiline,
    truncate: opt.truncate,
    combine: opt.combine,
    terse: opt.terse,
  }),
);

//
// Exit.
//

Deno.exit(0);
