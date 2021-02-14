/**
 * Lexer error.
 */
export class LexErr extends Error {
  /** Error line number. */
  public line: number;
  /** Error column number. */
  public col: number;
  /**
   * Construct a lexer error.
   * @param d The malformed path data source.
   * @param pos Source position.
   */
  constructor(public d: string, public pos: number) {
    super();
    this.line = 1 + (d.substring(0, pos).match(/\n/g)?.length || 0) || 1;
    const from = d.lastIndexOf("\n", pos);
    this.col = ~from ? pos - from - 1 : pos;
  }
  /** A number ends with a decimal "dot". */
  isTrailingDot(): this is TrailingDotErr {
    return false;
  }
  /** Unregconized content. */
  isUnrecognized(): this is UnrecognizedErr {
    return false;
  }
  /** Path data first command is not m / M. */
  isNotBeginWithMoveTo(): this is NotBeginWithMoveToErr {
    return false;
  }
  /** Path data begins with comma. */
  isBeginWithComma(): this is BeginWithCommaErr {
    return false;
  }
  /** Path data ends with comma. */
  isEndWithComma(): this is EndWithCommaErr {
    return false;
  }
  /** Command letter followed by comma. */
  isCmdFollowedByComma(): this is CmdFollowedByCommaErr {
    return false;
  }
  /** Command letter follows comma. */
  isCmdFollowsComma(): this is CmdFollowsCommaErr {
    return false;
  }
  /** Commas in a row. */
  isConsecutiveCommas(): this is ConsecutiveCommasErr {
    return false;
  }
  /** Number doesn't belong to any command. */
  isNumIsNotParam(): this is NumIsNotParamErr {
    return false;
  }
  /** Arc command large-arc-flag or sweep-flag is not "0" or "1". */
  isFlagIsNotZeroOrOne(): this is FlagIsNotZeroOrOneErr {
    return false;
  }
  /** Arc command rx (/ ry ) is negative. */
  isRadiusIsNegative(): this is RadiusIsNegativeErr {
    return false;
  }
  /** Too few command parameters. */
  isTooFewParams(): this is TooFewParamsErr {
    return false;
  }
}

export class UnrecognizedErr extends LexErr {
  isUnrecognized() {
    return true;
  }
}

export class TrailingDotErr extends LexErr {
  isTrailingDot() {
    return true;
  }
}

export class NotBeginWithMoveToErr extends LexErr {
  isNotBeginWithMoveTo() {
    return true;
  }
}
export class BeginWithCommaErr extends LexErr {
  isBeginWithComma() {
    return true;
  }
}

export class EndWithCommaErr extends LexErr {
  isEndWithComma() {
    return true;
  }
}

export class CmdFollowedByCommaErr extends LexErr {
  isCmdFollowedByComma() {
    return true;
  }
}

export class CmdFollowsCommaErr extends LexErr {
  isCmdFollowsComma() {
    return true;
  }
}

export class ConsecutiveCommasErr extends LexErr {
  isConsecutiveCommas() {
    return true;
  }
}

export class NumIsNotParamErr extends LexErr {
  isNumIsNotParam() {
    return true;
  }
}

export class FlagIsNotZeroOrOneErr extends LexErr {
  isFlagIsNotZeroOrOne() {
    return true;
  }
}

export class RadiusIsNegativeErr extends LexErr {
  isRadiusIsNegative() {
    return true;
  }
}

export class TooFewParamsErr extends LexErr {
  isTooFewParams() {
    return true;
  }
}
