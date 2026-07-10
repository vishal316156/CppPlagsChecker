export function createNGrams(tokens, size) {
  if (!Array.isArray(tokens)) {
    throw new TypeError("Tokens must be an array");
  }

  if (!Number.isInteger(size) || size <= 0) {
    throw new Error("N-gram size must be a positive integer");
  }

  const ngrams = new Set();
  if (tokens.length < size) {
    return ngrams;
  }

  for (let i = 0; i <= tokens.length - size; i++) {
    const gram = tokens
      .slice(i, i + size)
      .join("\u001F");

    ngrams.add(gram);
  }
  return ngrams;
}