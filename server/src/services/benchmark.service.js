import { tokenizeCpp } from "./tokenizer.service.js";
import { normalizeTokens } from "./normalizer.service.js";
import { createNGrams } from "./ngram.service.js";
import { calculateJaccardSimilarity } from "./similarity.service.js";
import { createWinnowingFingerprints } from "./winnowing.service.js";
import { evaluatePredictions } from "./evaluation.service.js";

function calculateScores(codeA, codeB) {
  const tokensA = normalizeTokens(tokenizeCpp(codeA));
  const tokensB = normalizeTokens(tokenizeCpp(codeB));

  const shortA = createNGrams(tokensA, 5);
  const shortB = createNGrams(tokensB, 5);

  const longA = createNGrams(tokensA, 15);
  const longB = createNGrams(tokensB, 15);

  const shortScore = calculateJaccardSimilarity(shortA, shortB);
  const longScore = calculateJaccardSimilarity(longA, longB);

  const ngramScore =
    shortScore * 0.4 +
    longScore * 0.6;

  const fingerprintsA =
    createWinnowingFingerprints(tokensA, 5, 4);

  const fingerprintsB =
    createWinnowingFingerprints(tokensB, 5, 4);

  const winnowingScore =
    calculateJaccardSimilarity(
      fingerprintsA,
      fingerprintsB
    );

  return {
    ngramScore,
    winnowingScore
  };
}

const benchmarkPairs = [
  {
    name: "renamed variables",
    label: "SHOULD_FLAG",

    codeA: `
      int main() {
        int sum = 0;
        for(int i = 0; i < 100; i++) {
          sum += i;
        }
        return sum;
      }
    `,

    codeB: `
      int main() {
        int answer = 0;
        for(int index = 0; index < 100; index++) {
          answer += index;
        }
        return answer;
      }
    `
  },

  {
    name: "comments and formatting",
    label: "SHOULD_FLAG",

    codeA: `
      int main() {
        int x = 10;
        x++;
        return x;
      }
    `,

    codeB: `
      // program begins
      int main()
      {
        int value = 10;

        /* update value */
        value++;

        return value;
      }
    `
  },

  {
    name: "literal changes",
    label: "SHOULD_FLAG",

    codeA: `
      int main() {
        int x = 10;
        x += 20;
        return x;
      }
    `,

    codeB: `
      int main() {
        int value = 999;
        value += 500;
        return value;
      }
    `
  },

  {
    name: "dead code insertion",
    label: "SHOULD_FLAG",

    codeA: `
      int main() {
        int sum = 0;

        for(int i = 0; i < 100; i++) {
          sum += i;
        }

        return sum;
      }
    `,

    codeB: `
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
    `
  },

  {
    name: "statement reordering",
    label: "SHOULD_FLAG",

    codeA: `
      int main() {
        int a = 10;
        int b = 20;
        a++;
        b--;
        return a + b;
      }
    `,

    codeB: `
      int main() {
        int x = 10;
        int y = 20;
        y--;
        x++;
        return x + y;
      }
    `
  },

  {
    name: "for rewritten as while",
    label: "SHOULD_FLAG",

    codeA: `
      int main() {
        int sum = 0;

        for(int i = 0; i < 100; i++) {
          sum += i;
        }

        return sum;
      }
    `,

    codeB: `
      int main() {
        int answer = 0;
        int index = 0;

        while(index < 100) {
          answer += index;
          index++;
        }

        return answer;
      }
    `
  },

  {
    name: "sum vs binary search",
    label: "SHOULD_NOT_FLAG",

    codeA: `
      int sum(vector<int>& arr) {
        int result = 0;

        for(int value : arr) {
          result += value;
        }

        return result;
      }
    `,

    codeB: `
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
    `
  },

  {
    name: "sorting vs dfs",
    label: "SHOULD_NOT_FLAG",

    codeA: `
      void bubbleSort(vector<int>& arr) {
        int n = arr.size();

        for(int i = 0; i < n; i++) {
          for(int j = 0; j + 1 < n - i; j++) {
            if(arr[j] > arr[j + 1]) {
              swap(arr[j], arr[j + 1]);
            }
          }
        }
      }
    `,

    codeB: `
      void dfs(
        int node,
        vector<vector<int>>& graph,
        vector<int>& visited
      ) {
        visited[node] = 1;

        for(int next : graph[node]) {
          if(!visited[next]) {
            dfs(next, graph, visited);
          }
        }
      }
    `
  },

  {
    name: "gcd vs palindrome",
    label: "SHOULD_NOT_FLAG",

    codeA: `
      int gcd(int a, int b) {
        while(b != 0) {
          int temp = a % b;
          a = b;
          b = temp;
        }

        return a;
      }
    `,

    codeB: `
      bool palindrome(string s) {
        int left = 0;
        int right = s.size() - 1;

        while(left < right) {
          if(s[left] != s[right]) {
            return false;
          }

          left++;
          right--;
        }

        return true;
      }
    `
  },

  {
    name: "kadane vs dsu",
    label: "SHOULD_NOT_FLAG",

    codeA: `
      int maxSubarray(vector<int>& arr) {
        int current = arr[0];
        int best = arr[0];

        for(int i = 1; i < arr.size(); i++) {
          current = max(arr[i], current + arr[i]);
          best = max(best, current);
        }

        return best;
      }
    `,

    codeB: `
      int find(int node, vector<int>& parent) {
        if(parent[node] == node) {
          return node;
        }

        return parent[node] =
          find(parent[node], parent);
      }
    `
  }
];

const WINNOWING_THRESHOLD = 0.20;

export function runBenchmark() {
  const results = benchmarkPairs.map((pair) => {
    const scores = calculateScores(
      pair.codeA,
      pair.codeB
    );

    const predictedFlag =
      scores.winnowingScore >= WINNOWING_THRESHOLD;

    return {
      name: pair.name,
      expected: pair.label,

      predicted: predictedFlag
        ? "SHOULD_FLAG"
        : "SHOULD_NOT_FLAG",

      passed: (pair.label === "SHOULD_FLAG" && predictedFlag) ||(pair.label === "SHOULD_NOT_FLAG" && !predictedFlag),

      ngramScore: scores.ngramScore,
      winnowingScore: scores.winnowingScore,

      codeA: pair.codeA,
      codeB: pair.codeB,
    };
  });

  const evaluationInput = results.map((result) => ({
    label: result.expected,
    predictedFlag:
      result.predicted === "SHOULD_FLAG"
  }));

  const metrics =
    evaluatePredictions(evaluationInput);

  return {
    totalCases: results.length,
    metrics,
    results
  };
}