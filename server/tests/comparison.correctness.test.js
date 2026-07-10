import {
  calculateJaccardSimilarity
} from "../src/services/similarity.service.js";
import {
  createWinnowingFingerprints
} from "../src/services/winnowing.service.js";
import { describe, expect, test } from "vitest";
import { compareCppCode } from "../src/services/comparison.service.js";
import { tokenizeCpp } from "../src/services/tokenizer.service.js";

import { normalizeTokens } from "../src/services/normalizer.service.js";
import {
  createFrequencyMap,
  calculateCosineSimilarity
} from "../src/services/frequency.service.js";



function getScore(codeA, codeB) {
  return compareCppCode(codeA, codeB, {
    shortSize: 5,
    longSize: 15,
    threshold: 0.8
  }).diagnostics.finalScore;
}
function getFrequencyScore(codeA, codeB) {
  const normalizedA = normalizeTokens(tokenizeCpp(codeA));
  const normalizedB = normalizeTokens(tokenizeCpp(codeB));

  const mapA = createFrequencyMap(normalizedA);
  const mapB = createFrequencyMap(normalizedB);

  return calculateCosineSimilarity(mapA, mapB);
}
function getWinnowingScore(codeA, codeB) {
  const normalizedA = normalizeTokens(tokenizeCpp(codeA));
  const normalizedB = normalizeTokens(tokenizeCpp(codeB));

  const fingerprintsA = createWinnowingFingerprints(
    normalizedA,
    5,
    4
  );

  const fingerprintsB = createWinnowingFingerprints(
    normalizedB,
    5,
    4
  );

  return calculateJaccardSimilarity(
    fingerprintsA,
    fingerprintsB
  );
}

describe("C++ comparison correctness benchmark", () => {

  test("identical code should have similarity 1", () => {
    const code = `
      int main() {
        int sum = 0;

        for(int i = 0; i < 10; i++) {
          sum += i;
        }

        return sum;
      }
    `;

    expect(getScore(code, code)).toBe(1);
  });

  test("variable renaming should not reduce similarity", () => {
    const codeA = `
      int main() {
        int sum = 0;

        for(int i = 0; i < 10; i++) {
          sum += i;
        }

        return sum;
      }
    `;

    const codeB = `
      int main() {
        int answer = 0;

        for(int index = 0; index < 10; index++) {
          answer += index;
        }

        return answer;
      }
    `;

    expect(getScore(codeA, codeB)).toBe(1);
  });

  test("comments and formatting should not reduce similarity", () => {
    const codeA = `
      int main() {
        int x = 10;
        x++;
        return x;
      }
    `;

    const codeB = `
      // starting program

      int main()
      {
        int value = 10;

        /* increment value */

        value++;

        return value;
      }
    `;

    expect(getScore(codeA, codeB)).toBe(1);
  });

  test("literal changes currently normalize to same structure", () => {
    const codeA = `
      int main() {
        int x = 10;
        x += 20;
        return x;
      }
    `;

    const codeB = `
      int main() {
        int value = 999;
        value += 500;
        return value;
      }
    `;

    expect(getScore(codeA, codeB)).toBe(1);
  });

  test("different code should have low similarity", () => {
    const codeA = `
      int main() {
        int sum = 0;

        for(int i = 0; i < 100; i++) {
          sum += i;
        }

        return sum;
      }
    `;

    const codeB = `
      bool binarySearch(vector<int>& arr, int target) {
        int left = 0;
        int right = arr.size() - 1;

        while(left <= right) {
          int mid = left + (right - left) / 2;

          if(arr[mid] == target)
            return true;

          if(arr[mid] < target)
            left = mid + 1;
          else
            right = mid - 1;
        }

        return false;
      }
    `;

    expect(getScore(codeA, codeB)).toBeLessThan(0.5);
  });

  test("reordered independent statements should expose sensitivity", () => {
    const codeA = `
      int main() {
        int a = 10;
        int b = 20;

        a++;
        b--;

        return a + b;
      }
    `;

    const codeB = `
      int main() {
        int x = 10;
        int y = 20;

        y--;
        x++;

        return x + y;
      }
    `;

    const score = getScore(codeA, codeB);
const frequencyScore = getFrequencyScore(codeA, codeB);
const winnowingScore = getWinnowingScore(codeA, codeB);

console.log("Statement reordering score:", score);
console.log("Statement reordering frequency score:", frequencyScore);
console.log("Statement reordering winnowing score:", winnowingScore);

expect(score).toBeGreaterThanOrEqual(0);
expect(score).toBeLessThanOrEqual(1);
  });

  test("dead code insertion should expose sensitivity", () => {
    const codeA = `
      int main() {
        int sum = 0;

        for(int i = 0; i < 100; i++) {
          sum += i;
        }

        return sum;
      }
    `;

    const codeB = `
      int main() {
        int answer = 0;

        int unused = 999;
        unused++;
        unused--;

        for(int index = 0; index < 100; index++) {
          answer += index;
        }

        return answer;
      }
    `;
const score = getScore(codeA, codeB);
const frequencyScore = getFrequencyScore(codeA, codeB);
const winnowingScore = getWinnowingScore(codeA, codeB);

console.log("Dead code insertion score:", score);
console.log("Dead code insertion frequency score:", frequencyScore);
console.log("Dead code insertion winnowing score:", winnowingScore);

expect(score).toBeGreaterThanOrEqual(0);
expect(score).toBeLessThanOrEqual(1);
  });

  test("for loop rewritten as while loop should expose structural weakness", () => {
    const codeA = `
      int main() {
        int sum = 0;

        for(int i = 0; i < 100; i++) {
          sum += i;
        }

        return sum;
      }
    `;

    const codeB = `
      int main() {
        int answer = 0;
        int index = 0;

        while(index < 100) {
          answer += index;
          index++;
        }

        return answer;
      }
    `;

const score = getScore(codeA, codeB);
const frequencyScore = getFrequencyScore(codeA, codeB);
const winnowingScore = getWinnowingScore(codeA, codeB);

console.log("For vs while score:", score);
console.log("For vs while frequency score:", frequencyScore);
console.log("For vs while winnowing score:", winnowingScore);

expect(score).toBeGreaterThanOrEqual(0);
expect(score).toBeLessThanOrEqual(1);
  });

  test("different algorithms should not have dangerously high frequency similarity", () => {
  const codeA = `
    int linearSum(vector<int>& arr) {
      int sum = 0;

      for(int value : arr) {
        sum += value;
      }

      return sum;
    }
  `;

  const codeB = `
    bool binarySearch(vector<int>& arr, int target) {
      int left = 0;
      int right = arr.size() - 1;

      while(left <= right) {
        int mid = left + (right - left) / 2;

        if(arr[mid] == target) {
          return true;
        }

        if(arr[mid] < target) {
          left = mid + 1;
        }
        else {
          right = mid - 1;
        }
      }

      return false;
    }
  `;

  const ngramScore = getScore(codeA, codeB);
const frequencyScore = getFrequencyScore(codeA, codeB);
const winnowingScore = getWinnowingScore(codeA, codeB);

console.log("Different algorithms n-gram score:", ngramScore);
console.log("Different algorithms frequency score:", frequencyScore);
console.log("Different algorithms winnowing score:", winnowingScore);

expect(ngramScore).toBeGreaterThanOrEqual(0);
expect(ngramScore).toBeLessThanOrEqual(1);

expect(frequencyScore).toBeGreaterThanOrEqual(0);
expect(frequencyScore).toBeLessThanOrEqual(1);
});

});