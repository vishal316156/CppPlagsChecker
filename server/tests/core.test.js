import { describe, expect, test } from "vitest";

import {
  checkCppSimilarity
} from "../src/core/checkCppSimilarity.js";

describe("C++ similarity core detector", () => {
  test("flags identical code", () => {
    const code = `
      int main() {
        int sum = 0;
        for(int i = 0; i < 100; i++) {
          sum += i;
        }

        return sum;
      }
    `;

    const result = checkCppSimilarity(code, code);

    expect(result.flagged).toBe(true);
    expect(result.similarityScore).toBe(1);
  });

  test("flags renamed equivalent code", () => {
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

        for(int index = 0; index < 100; index++) {
          answer += index;
        }

        return answer;
      }
    `;

    const result = checkCppSimilarity(codeA, codeB);

    expect(result.flagged).toBe(true);
  });

  test("does not flag clearly different algorithms", () => {
    const codeA = `
      int sum(vector<int>& arr) {
        int result = 0;

        for(int value : arr) {
          result += value;
        }

        return result;
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

    const result = checkCppSimilarity(codeA, codeB);

    expect(result.flagged).toBe(false);
  });

  test("rejects empty code", () => {
    expect(() => {
      checkCppSimilarity("", "int main(){}");
    }).toThrow("C++ codes cannot be empty");
  });

  test("rejects invalid threshold", () => {
    expect(() => {
      checkCppSimilarity(
        "int main(){}",
        "int main(){}",
        { threshold: 2 }
      );
    }).toThrow("Threshold must be between 0 and 1");
  });
});