import { CmdTy } from "./tokenizer.ts";

export abstract class Seg {
  abstract cmd: CmdTy;
  isM(): this is SegM {
    return false;
  }
  isL(): this is SegL {
    return false;
  }
  isH(): this is SegH {
    return false;
  }
  isV(): this is SegV {
    return false;
  }
  isC(): this is SegC {
    return false;
  }
  isS(): this is SegS {
    return false;
  }
  isQ(): this is SegQ {
    return false;
  }
  isT(): this is SegT {
    return false;
  }
  isA(): this is SegA {
    return false;
  }
  isZ(): this is SegZ {
    return false;
  }
  abstract isAbs(): boolean;
  abstract isRel(): boolean;
  abstract toAbs(x: number, y: number): void;
  abstract toRel(x: number, y: number): void;
  abstract clone(): Seg;
  abstract isCmdEq(seg: Seg): boolean;
}

export class SegM extends Seg {
  constructor(public cmd: "M" | "m", private pars: [number, number]) {
    super();
  }
  isM(): this is SegM {
    return true;
  }
  isAbs() {
    return this.cmd === "M";
  }
  isRel() {
    return this.cmd === "m";
  }
  toAbs(x: number, y: number) {
    if (this.isRel()) {
      this.x += x;
      this.y += y;
      this.cmd = "M";
    }
  }
  toRel(x: number, y: number) {
    if (this.isAbs()) {
      this.x -= x;
      this.y -= y;
      this.cmd = "m";
    }
  }
  clone() {
    return new SegM(this.cmd, [...this.pars]);
  }
  isCmdEq(seg: Seg) {
    return seg.isM() && seg.isAbs() === this.isAbs();
  }
  get x() {
    return this.pars[0];
  }
  set x(x) {
    this.pars[0] = x;
  }
  get y() {
    return this.pars[1];
  }
  set y(y) {
    this.pars[1] = y;
  }
}

export class SegL extends Seg {
  constructor(public cmd: "L" | "l", private pars: [number, number]) {
    super();
  }
  isL(): this is SegL {
    return true;
  }
  isAbs() {
    return this.cmd === "L";
  }
  isRel() {
    return this.cmd === "l";
  }
  toAbs(x: number, y: number) {
    if (this.isRel()) {
      this.x += x;
      this.y += y;
      this.cmd = "L";
    }
  }
  toRel(x: number, y: number) {
    if (this.isAbs()) {
      this.x -= x;
      this.y -= y;
      this.cmd = "l";
    }
  }
  clone() {
    return new SegL(this.cmd, [...this.pars]);
  }
  isCmdEq(seg: Seg) {
    return seg.isL() && seg.isAbs() === this.isAbs();
  }
  get x() {
    return this.pars[0];
  }
  set x(x) {
    this.pars[0] = x;
  }
  get y() {
    return this.pars[1];
  }
  set y(y) {
    this.pars[1] = y;
  }
}

export class SegH extends Seg {
  constructor(public cmd: "H" | "h", private pars: [number]) {
    super();
  }
  isH(): this is SegH {
    return true;
  }
  isAbs() {
    return this.cmd === "H";
  }
  isRel() {
    return this.cmd === "h";
  }
  toAbs(x: number, y: number) {
    if (this.isRel()) {
      this.x += x;
      this.cmd = "H";
    }
  }
  toRel(x: number, y: number) {
    if (this.isAbs()) {
      this.x -= x;
      this.cmd = "h";
    }
  }
  clone() {
    return new SegH(this.cmd, [...this.pars]);
  }
  isCmdEq(seg: Seg) {
    return seg.isH() && seg.isAbs() === this.isAbs();
  }
  get x() {
    return this.pars[0];
  }
  set x(x) {
    this.pars[0] = x;
  }
}

export class SegV extends Seg {
  constructor(public cmd: "V" | "v", private pars: [number]) {
    super();
  }
  isV(): this is SegV {
    return true;
  }
  isAbs() {
    return this.cmd === "V";
  }
  isRel() {
    return this.cmd === "v";
  }
  toAbs(x: number, y: number) {
    if (this.isRel()) {
      this.y += y;
      this.cmd = "V";
    }
  }
  toRel(x: number, y: number) {
    if (this.isAbs()) {
      this.y -= y;
      this.cmd = "v";
    }
  }
  clone() {
    return new SegV(this.cmd, [...this.pars]);
  }
  isCmdEq(seg: Seg) {
    return seg.isV() && seg.isAbs() === this.isAbs();
  }
  get y() {
    return this.pars[0];
  }
  set y(y) {
    this.pars[0] = y;
  }
}

export class SegS extends Seg {
  constructor(
    public cmd: "S" | "s",
    private pars: [number, number, number, number],
  ) {
    super();
  }
  isS(): this is SegS {
    return true;
  }
  isAbs() {
    return this.cmd === "S";
  }
  isRel() {
    return this.cmd === "s";
  }
  toAbs(x: number, y: number) {
    if (this.isRel()) {
      this.x2 += x;
      this.y2 += y;
      this.x += this.x2;
      this.y += this.y2;
      this.cmd = "S";
    }
  }
  toRel(x: number, y: number) {
    if (this.isAbs()) {
      this.x -= this.x2;
      this.y -= this.y2;
      this.x2 -= x;
      this.y2 -= y;
      this.cmd = "s";
    }
  }
  clone() {
    return new SegS(this.cmd, [...this.pars]);
  }
  isCmdEq(seg: Seg) {
    return seg.isS() && seg.isAbs() === this.isAbs();
  }
  get x2() {
    return this.pars[0];
  }
  set x2(x) {
    this.pars[0] = x;
  }
  get y2() {
    return this.pars[1];
  }
  set y2(y) {
    this.pars[1] = y;
  }
  get x() {
    return this.pars[2];
  }
  set x(x) {
    this.pars[2] = x;
  }
  get y() {
    return this.pars[3];
  }
  set y(y) {
    this.pars[3] = y;
  }
}

export class SegQ extends Seg {
  constructor(
    public cmd: "Q" | "q",
    private pars: [number, number, number, number],
  ) {
    super();
  }
  isQ(): this is SegQ {
    return true;
  }
  isAbs() {
    return this.cmd === "Q";
  }
  isRel() {
    return this.cmd === "q";
  }
  toAbs(x: number, y: number) {
    if (this.isRel()) {
      this.x1 += x;
      this.y1 += y;
      this.x += this.x1;
      this.y += this.y1;
      this.cmd = "Q";
    }
  }
  toRel(x: number, y: number) {
    if (this.isAbs()) {
      this.x -= this.x1;
      this.y -= this.y1;
      this.x1 -= x;
      this.y1 -= y;
      this.cmd = "q";
    }
  }
  clone() {
    return new SegQ(this.cmd, [...this.pars]);
  }
  isCmdEq(seg: Seg) {
    return seg.isQ() && seg.isAbs() === this.isAbs();
  }
  get x1() {
    return this.pars[0];
  }
  set x1(x) {
    this.pars[0] = x;
  }
  get y1() {
    return this.pars[1];
  }
  set y1(y) {
    this.pars[1] = y;
  }
  get x() {
    return this.pars[2];
  }
  set x(x) {
    this.pars[2] = x;
  }
  get y() {
    return this.pars[3];
  }
  set y(y) {
    this.pars[3] = y;
  }
}

export class SegT extends Seg {
  constructor(public cmd: "T" | "t", private pars: [number, number]) {
    super();
  }
  isT(): this is SegT {
    return true;
  }
  isAbs() {
    return this.cmd === "T";
  }
  isRel() {
    return this.cmd === "t";
  }
  toAbs(x: number, y: number) {
    if (this.isRel()) {
      this.x += x;
      this.y += y;
      this.cmd = "T";
    }
  }
  toRel(x: number, y: number) {
    if (this.isAbs()) {
      this.x -= x;
      this.y -= y;
      this.cmd = "t";
    }
  }
  clone() {
    return new SegT(this.cmd, [...this.pars]);
  }
  isCmdEq(seg: Seg) {
    return seg.isT() && seg.isAbs() === this.isAbs();
  }
  get x() {
    return this.pars[0];
  }
  set x(x) {
    this.pars[0] = x;
  }
  get y() {
    return this.pars[1];
  }
  set y(y) {
    this.pars[1] = y;
  }
}

export class SegC extends Seg {
  constructor(
    public cmd: "C" | "c",
    private pars: [number, number, number, number, number, number],
  ) {
    super();
  }
  isC(): this is SegC {
    return true;
  }
  isAbs() {
    return this.cmd === "C";
  }
  isRel() {
    return this.cmd === "c";
  }
  toAbs(x: number, y: number) {
    if (this.isRel()) {
      this.x1 += x;
      this.y1 += y;
      this.x2 += this.x1;
      this.y2 += this.y1;
      this.x += this.x2;
      this.y += this.y2;
      this.cmd = "C";
    }
  }
  toRel(x: number, y: number) {
    if (this.isAbs()) {
      this.x -= this.x2;
      this.y -= this.y2;
      this.x2 -= this.x1;
      this.y2 -= this.y1;
      this.x1 -= x;
      this.y1 -= y;
      this.cmd = "c";
    }
  }
  clone() {
    return new SegC(this.cmd, [...this.pars]);
  }
  isCmdEq(seg: Seg) {
    return seg.isC() && seg.isAbs() === this.isAbs();
  }
  get x1() {
    return this.pars[0];
  }
  set x1(x) {
    this.pars[0] = x;
  }
  get y1() {
    return this.pars[1];
  }
  set y1(y) {
    this.pars[1] = y;
  }
  get x2() {
    return this.pars[2];
  }
  set x2(x) {
    this.pars[2] = x;
  }
  get y2() {
    return this.pars[3];
  }
  set y2(y) {
    this.pars[3] = y;
  }
  get x() {
    return this.pars[4];
  }
  set x(x) {
    this.pars[4] = x;
  }
  get y() {
    return this.pars[5];
  }
  set y(y) {
    this.pars[5] = y;
  }
}

export class SegA extends Seg {
  constructor(
    public cmd: "A" | "a",
    private pars: [number, number, number, boolean, boolean, number, number],
  ) {
    super();
    pars[0];
    pars[1];
  }
  isA(): this is SegA {
    return true;
  }
  isAbs() {
    return this.cmd === "A";
  }
  isRel() {
    return this.cmd === "a";
  }
  toAbs(x: number, y: number) {
    if (this.isRel()) {
      this.x += x;
      this.y += y;
      this.cmd = "A";
    }
  }
  toRel(x: number, y: number) {
    if (this.isAbs()) {
      this.x -= x;
      this.y -= y;
      this.cmd = "a";
    }
  }
  clone() {
    return new SegA(this.cmd, [...this.pars]);
  }
  isCmdEq(seg: Seg) {
    return seg.isA() && seg.isAbs() === this.isAbs();
  }
  get rx() {
    return this.pars[0];
  }
  set rx(rx) {
    this.pars[0] = rx;
  }
  get ry() {
    return this.pars[1];
  }
  set ry(ry) {
    this.pars[1] = ry;
  }
  get xAxisRotation() {
    return this.pars[2];
  }
  set xAxisRotation(r) {
    this.pars[2] = r;
  }
  get largeArcFlag() {
    return this.pars[3];
  }
  set largeArcFlag(f) {
    this.pars[3] = f;
  }
  get sweepFlag() {
    return this.pars[4];
  }
  set sweepFlag(f) {
    this.pars[4] = f;
  }
  get x() {
    return this.pars[5];
  }
  set x(x) {
    this.pars[5] = x;
  }
  get y() {
    return this.pars[6];
  }
  set y(y) {
    this.pars[6] = y;
  }
}

export class SegZ extends Seg {
  constructor(public cmd: "Z" | "z") {
    super();
  }
  isZ(): this is SegZ {
    return true;
  }
  isAbs() {
    return this.cmd === "Z";
  }
  isRel() {
    return this.cmd === "z";
  }
  toAbs(x: number, y: number) {
    if (this.isRel()) {
      this.cmd = "Z";
    }
  }
  toRel(x: number, y: number) {
    if (this.isAbs()) {
      this.cmd = "z";
    }
  }
  clone() {
    return new SegZ(this.cmd);
  }
  isCmdEq(seg: Seg) {
    return seg.isZ() && seg.isAbs() === this.isAbs();
  }
}
