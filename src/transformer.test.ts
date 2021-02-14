import { assertEquals } from "testing/asserts.ts";
import { transform } from "./transformer.ts";
import { parse } from "./parser.ts";
import { SegL, SegM } from "./seg.ts";

Deno.test("transformer: map segs", () => {
  const segs0 = parse("M 150 150 L 200 200");
  const segs1 = transform(segs0, (seg) => {
    if (seg.isM()) {
      seg.x -= 50;
      seg.y -= 50;
    }
    return seg;
  });

  assertEquals(segs1, [
    new SegM("M", [100, 100]),
    new SegL("L", [200, 200]),
  ]);
});
