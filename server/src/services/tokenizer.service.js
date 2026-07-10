import {
  CPP_KEYWORDS,
  MULTI_CHAR_OPERATORS,
  SINGLE_CHAR_OPERATORS
} from "../constants/cpp.constants.js";

function isWhitespace(char) {
  return /\s/.test(char);
}

function isIdentifierStart(char) {
  return /[A-Za-z_]/.test(char);
}

function isIdentifierPart(char) {
  return /[A-Za-z0-9_]/.test(char);
}

function isDigit(char) {
  return /[0-9]/.test(char);
}

function readQuotedLiteral(code, startIndex, quote) {
  let i = startIndex + 1;

  while (i < code.length) {
    if (code[i] === "\\") {
      i += 2;
      continue;
    }

    if (code[i] === quote) {
      return i + 1;
    }

    i++;
  }

  throw new Error("Unterminated quoted literal");
}

function readNumber(code, startIndex) {
  let i = startIndex;

  while (
    i < code.length &&
    /[A-Za-z0-9_.'+-]/.test(code[i])
  ) {
    if (
      (code[i] === "+" || code[i] === "-") &&
      code[i - 1] !== "e" &&
      code[i - 1] !== "E" &&
      code[i - 1] !== "p" &&
      code[i - 1] !== "P"
    ) {
      break;
    }

    i++;
  }
  return i;
}

function matchMultiCharacterOperator(code, index) {
  for (const operator of MULTI_CHAR_OPERATORS) {
    if (code.startsWith(operator, index)) {
      return operator;
    }
  }
  return null;
}

export function tokenizeCpp(code) {
  if (typeof code !== "string") {
    throw new TypeError("Code must be a string");
  }

  const tokens = [];
  let i = 0;
  let atLineStart = true;

  while (i < code.length) {
    const char = code[i];
    if (char === "\n") {
      atLineStart = true;
      i++;
      continue;
    }

    if (isWhitespace(char)) {
      i++;
      continue;
    }

    if (atLineStart && char === "#") {
      while (i < code.length) {
        if (code[i] === "\n") {
          let backslashCount = 0;
          let j = i - 1;

          while (j >= 0 && code[j] === "\\") {
            backslashCount++;
            j--;
          }

          if (backslashCount % 2 === 0) {
            break;
          }
        }

        i++;
      }
      continue;
    }

    atLineStart = false;

    // Single-line comment handelling
    if (code.startsWith("//", i)) {
      i += 2;

      while (i < code.length && code[i] !== "\n") {
        i++;
      }

      continue;
    }
    // Multi-line comment
    if (code.startsWith("/*", i)) {
      const closingIndex = code.indexOf("*/", i + 2);

      if (closingIndex === -1) {
        throw new Error("Unterminated block comment");
      }
      i = closingIndex + 2;
      continue;
    }

    // String literal
    if (char === '"') {
      i = readQuotedLiteral(code, i, '"');

      tokens.push({
        type: "STRING_LITERAL",
        value: "STRING_LITERAL"
      });

      continue;
    }
    // Character literal
    if (char === "'") {
      i = readQuotedLiteral(code, i, "'");

      tokens.push({
        type: "CHAR_LITERAL",
        value: "CHAR_LITERAL"
      });

      continue;
    }
    // Identifier or keyword
    if (isIdentifierStart(char)) {
      const start = i;

      i++;

      while (i < code.length && isIdentifierPart(code[i])) {
        i++;
      }
      const value = code.slice(start, i);
      tokens.push({
        type: CPP_KEYWORDS.has(value) ? "KEYWORD" : "IDENTIFIER",
        value
      });

      continue;
    }
    // Number literal
    if (
      isDigit(char) ||
      (char === "." && isDigit(code[i + 1] ?? ""))
    ) {
      const start = i;

      i = readNumber(code, i);

      tokens.push({
        type: "NUMBER_LITERAL",
        value: code.slice(start, i)
      });

      continue;
    }

    const multiCharacterOperator =
      matchMultiCharacterOperator(code, i);

    if (multiCharacterOperator !== null) {
      tokens.push({
        type: "SYMBOL",
        value: multiCharacterOperator
      });

      i += multiCharacterOperator.length;
      continue;
    }
    if (SINGLE_CHAR_OPERATORS.has(char)) {
      tokens.push({
        type: "SYMBOL",
        value: char
      });

      i++;
      continue;
    }

    throw new Error(`Unsupported C++ token near index ${i}`);
  }
  return tokens;
}