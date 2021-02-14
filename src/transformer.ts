import { Seg } from "./seg.ts";

/**
 * A fn which is called on each `Seg` clone. 
 * @param seg (cloned) Path segment.
 * @param idx Array index.
 * @param segs (cloned) Array of path segments. 
 */
export interface MapFn {
  (seg: Seg, idx: number, segs: Readonly<Seg[]>): Seg;
}

/**
 * Transform path segments.
 * @param segs Old path segments.
 * @param mapFn A map fn which is called on each `Seg` clone.
 * @returns New path segments.
 */
export function transform(segs: Seg[], mapFn: MapFn): Seg[] {
  return segs.map((s) => s.clone()).map(mapFn);
}
