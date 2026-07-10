export function normalizeTokens(tokens) {
  if (!Array.isArray(tokens)) {
    throw new TypeError("Tokens must be an array");
  }

  return tokens.map((token) => {
    if (token.type === "IDENTIFIER") {
      return "IDENTIFIER";
    }

    if (token.type === "NUMBER_LITERAL") {
      return "NUMBER_LITERAL";
    }
    if (token.type === "STRING_LITERAL") {
      return "STRING_LITERAL";
    }
    if (token.type === "CHAR_LITERAL") {
      return "CHAR_LITERAL";
    }

    return token.value;
  });
}