export class SafeMathError extends Error {}

const isDigit = (ch: string) => ch >= "0" && ch <= "9";

export function evaluateExpression(expression: string): number {
  const src = expression.trim();
  let pos = 0;

  const peek = () => src[pos];
  const eof = () => pos >= src.length;

  const skipWhitespace = () => {
    while (!eof() && /\s/.test(peek())) pos++;
  };

  const expectChar = (ch: string) => {
    skipWhitespace();
    if (peek() !== ch) {
      throw new SafeMathError(`Expected "${ch}" at position ${pos}`);
    }
    pos++;
  };

  const parseNumber = (): number => {
    skipWhitespace();
    const start = pos;
    if (!eof() && peek() === ".") {
      // leading-dot decimals like ".5" are fine
    }
    while (!eof() && isDigit(peek())) pos++;
    if (!eof() && peek() === ".") {
      pos++;
      while (!eof() && isDigit(peek())) pos++;
    }
    const raw = src.slice(start, pos);
    if (raw === "" || raw === ".") {
      throw new SafeMathError(`Expected a number at position ${start}`);
    }
    return Number(raw);
  };

  const parsePrimary = (): number => {
    skipWhitespace();
    if (eof()) throw new SafeMathError("Unexpected end of expression");

    const ch = peek();
    if (ch === "+") {
      pos++;
      return parsePrimary();
    }
    if (ch === "-") {
      pos++;
      return -parsePrimary();
    }
    if (ch === "(") {
      pos++;
      const value = parseAddSub();
      expectChar(")");
      return value;
    }
    if (isDigit(ch) || ch === ".") {
      return parseNumber();
    }
    throw new SafeMathError(`Unexpected character "${ch}" at position ${pos}`);
  };

  const parsePower = (): number => {
    const base = parsePrimary();
    skipWhitespace();
    if (!eof() && peek() === "^") {
      pos++;
      const exponent = parsePower();
      return Math.pow(base, exponent);
    }
    return base;
  };

  const parseTerm = (): number => {
    let value = parsePower();
    for (;;) {
      skipWhitespace();
      if (eof()) break;
      const op = peek();
      if (op === "*" || op === "/" || op === "%") {
        pos++;
        const rhs = parsePower();
        if (op === "*") value *= rhs;
        else if (op === "/") {
          if (rhs === 0) throw new SafeMathError("Division by zero");
          value /= rhs;
        } else value %= rhs;
      } else {
        break;
      }
    }
    return value;
  };

  const parseAddSub = (): number => {
    let value = parseTerm();
    for (;;) {
      skipWhitespace();
      if (eof()) break;
      const op = peek();
      if (op === "+" || op === "-") {
        pos++;
        const rhs = parseTerm();
        value = op === "+" ? value + rhs : value - rhs;
      } else {
        break;
      }
    }
    return value;
  };

  const result = parseAddSub();
  skipWhitespace();
  if (!eof()) {
    throw new SafeMathError(`Unexpected trailing input at position ${pos}`);
  }
  if (!Number.isFinite(result)) {
    throw new SafeMathError("Result is not a finite number");
  }
  return result;
}