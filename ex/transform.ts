import { parse, transform } from "../src/mod.ts";

const d = "M 10 20 30 40 H 50 V 60 z";
const segs0 = parse(d);
const segs1 = transform(segs0, (seg) => {
  if (seg.isM() || seg.isL()) {
    seg.x /= 100;
    seg.y /= 100;
  } else if (seg.isH()) {
    seg.x /= 100;
  } else if (seg.isV()) {
    seg.y /= 100;
  }
  return seg;
});
console.log(segs1);

// Output:
// [
//   SegM { cmd: "M", pars: [ 0.1, 0.2 ] },
//   SegL { cmd: "L", pars: [ 0.3, 0.4 ] },
//   SegH { cmd: "H", pars: [ 0.5 ] },
//   SegV { cmd: "V", pars: [ 0.6 ] },
//   SegZ { cmd: "z" }
// ]
