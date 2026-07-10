export function calculateJaccardSimilarity(setA, setB) {
  if (!(setA instanceof Set) || !(setB instanceof Set)) {
    throw new TypeError("Both inputs must be Set objects");
  }

  if (setA.size === 0 && setB.size === 0) {
    return 1;
  }

  if (setA.size === 0 || setB.size === 0) {
    return 0;
  }

  let intersectionSize = 0;

  const smallerSet =
    setA.size <= setB.size ? setA : setB;

  const largerSet =
    setA.size <= setB.size ? setB : setA;

  for (const value of smallerSet) {
    if (largerSet.has(value)) {
      intersectionSize++;
    }
  }
  const unionSize =
    setA.size + setB.size - intersectionSize;

  return intersectionSize / unionSize;
}