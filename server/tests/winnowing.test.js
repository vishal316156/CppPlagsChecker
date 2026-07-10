import { describe, expect, test } from "vitest";

import {
  createKGramHashes,
  selectWinnowingFingerprints,
  createWinnowingFingerprints
} from "../src/services/winnowing.service.js";

describe("winnowing fingerprinting", () => {
  test("identical token sequences produce identical fingerprints", () => {
    const tokens = [
      "int",
      "IDENTIFIER",
      "=",
      "NUMBER_LITERAL",
      ";",
      "return",
      "IDENTIFIER",
      ";"
    ];

    const fingerprintA =
      createWinnowingFingerprints(tokens, 3, 4);

    const fingerprintB =
      createWinnowingFingerprints(tokens, 3, 4);

    expect(fingerprintA).toEqual(fingerprintB);
  });

  test("returns empty hashes when token count is smaller than k", () => {
    expect(
      createKGramHashes(["int", "IDENTIFIER"], 3)
    ).toEqual([]);
  });

  test("short hash sequence still produces a fingerprint", () => {
    const hashes = createKGramHashes(
      [
        "int",
        "IDENTIFIER",
        "=",
        "NUMBER_LITERAL"
      ],
      3
    );

    const fingerprints =
      selectWinnowingFingerprints(hashes, 10);

    expect(fingerprints.size).toBeGreaterThan(0);
  });

  test("fingerprinting is deterministic", () => {
    const tokens = [
      "for",
      "(",
      "IDENTIFIER",
      "=",
      "NUMBER_LITERAL",
      ";",
      "IDENTIFIER",
      "<",
      "NUMBER_LITERAL",
      ";",
      "IDENTIFIER",
      "++",
      ")"
    ];

    const first =
      createWinnowingFingerprints(tokens, 5, 4);

    const second =
      createWinnowingFingerprints(tokens, 5, 4);

    expect(first).toEqual(second);
  });

  test("different token sequences can produce different fingerprints", () => {
    const tokensA = [
      "if",
      "(",
      "IDENTIFIER",
      ")",
      "return",
      "NUMBER_LITERAL"
    ];

    const tokensB = [
      "while",
      "(",
      "IDENTIFIER",
      ")",
      "IDENTIFIER",
      "++"
    ];

    const fingerprintA =
      createWinnowingFingerprints(tokensA, 3, 2);

    const fingerprintB =
      createWinnowingFingerprints(tokensB, 3, 2);

    expect(fingerprintA).not.toEqual(fingerprintB);
  });
});