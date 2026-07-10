function hashTokens(tokens) {
  const text = tokens.join("\u001F");

  let hash = 0x811c9dc5;

  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);

    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

export function createKGramHashes(tokens, k) {
  if (!Array.isArray(tokens)) {
    throw new TypeError("Tokens must be an array");
  }

  if (!Number.isInteger(k) || k <= 0) {
    throw new Error("k must be a positive integer");
  }

  if (tokens.length < k) {
    return [];
  }

  const hashes = [];

  for (let i = 0; i <= tokens.length - k; i++) {
    hashes.push({
      hash: hashTokens(tokens.slice(i, i + k)),
      position: i
    });
  }
  return hashes;
}

export function selectWinnowingFingerprints(hashes, windowSize) {
  if (!Array.isArray(hashes)) {
    throw new TypeError("Hashes must be an array");
  }

  if (!Number.isInteger(windowSize) || windowSize <= 0) {
    throw new Error("windowSize must be a positive integer");
  }

  if (hashes.length === 0) {
    return new Set();
  }

  const effectiveWindowSize = Math.min(
    windowSize,
    hashes.length
  );

  const fingerprints = new Set();

  let previousSelectedPosition = -1;

  for (
    let start = 0;
    start <= hashes.length - effectiveWindowSize;
    start++
  ) {
    const end = start + effectiveWindowSize;

    let minimum = hashes[start];

    for (let i = start + 1; i < end; i++) {
      if (
        hashes[i].hash < minimum.hash ||
        (
          hashes[i].hash === minimum.hash &&
          hashes[i].position > minimum.position
        )
      ) {
        minimum = hashes[i];
      }
    }

    if (minimum.position !== previousSelectedPosition) {
      fingerprints.add(minimum.hash);
      previousSelectedPosition = minimum.position;
    }
  }

  return fingerprints;
}

export function createWinnowingFingerprints(
  tokens,
  k,
  windowSize
) {
  const hashes = createKGramHashes(tokens, k);

  return selectWinnowingFingerprints(
    hashes,
    windowSize
  );
}