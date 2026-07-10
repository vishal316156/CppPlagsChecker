import { describe, expect, test } from "vitest";

import {
  tokenizeCpp
} from "../src/services/tokenizer.service.js";

describe("C++ tokenizer", () => {
  test("ignores comments", () => {
    const code = `
      int x = 10;

      // ignored

      /*
        ignored
      */

      return x;
    `;

    const values = tokenizeCpp(code).map(
      (token) => token.value
    );

    expect(values).toEqual([
      "int",
      "x",
      "=",
      "10",
      ";",
      "return",
      "x",
      ";"
    ]);
  });

  test("recognizes longest operator first", () => {
    const code = `
      a >>= 2;
      b++;
      c <= d;
      x::y;
    `;

    const values = tokenizeCpp(code).map(
      (token) => token.value
    );

    expect(values).toContain(">>=");
    expect(values).toContain("++");
    expect(values).toContain("<=");
    expect(values).toContain("::");
  });

  test("does not treat comment markers inside strings as comments", () => {
    const code = `
      string url = "https://example.com";
    `;

    const tokens = tokenizeCpp(code);

    expect(
      tokens.some(
        (token) => token.type === "STRING_LITERAL"
      )
    ).toBe(true);
  });

  test("throws for unterminated block comment", () => {
    expect(() => {
      tokenizeCpp("int x; /* broken");
    }).toThrow("Unterminated block comment");
  });
});