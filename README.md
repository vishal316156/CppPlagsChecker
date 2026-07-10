# 🔍 CppPlagsChecker

A C++ code similarity analysis tool that compares two submissions and highlights suspicious structural similarity.

Instead of comparing raw text, the engine processes source code through tokenization, normalization, n-gram analysis, and Winnowing fingerprints.

> **Note:** CppPlagsChecker is a similarity analysis tool, not a definitive plagiarism detector. A flagged result should be reviewed by a human.

---

## 🚀 Live Demo

🔗 **Frontend:** https://cpp-plags-checker-git-main-vishal-fullstack-dev.vercel.app/
<!-- 
🔗 **Backend API:** Add your Render URL here -->

---

## 🧠 Why I Built This

Two C++ programs can be logically identical while looking completely different.

Variables can be renamed. Comments can be removed or multi-lines comments can be added. Formatting can change. Extra code can be inserted.

A simple text comparison fails in these situations.

CppPlagsChecker was built to explore a better approach:

```text
C++ Code A + Code B
        ↓
Tokenization
        ↓
Normalization
        ↓
N-Gram Generation
        ↓
Winnowing Fingerprints
        ↓
Similarity Calculation
        ↓
Threshold Decision
        ↓
FLAGGED / NOT FLAGGED
```

---

## ✨ Features

- Compare two C++ submissions.
- Ignore comments and formatting differences.
- Reduce the effect of variable renaming.
- Generate short and long token n-grams.
- Extract fingerprints using the Winnowing algorithm.
- Calculate similarity using Jaccard similarity.
- Display similarity scores as percentages.
- Show detailed diagnostic metrics.
- Flag submissions that cross the configured threshold.
- Automated tests for individual engine components.
- Benchmark dataset for evaluating similarity rules.
- Responsive React interface.
- Separate frontend and backend deployments.

---

## ⚙️ How the Engine Works

### 1. Tokenization
The tokenizer converts C++ source code into a sequence of meaningful tokens.

```text
int sum = a + b;

↓

int
sum
=
a
+
b
;
```

Comments and unnecessary formatting are ignored.

---

### 2. Normalization

Identifiers and selected literals are converted into common representations.

```text
int sum = 10;
int answer = 500;

↓

TYPE ID = NUM ;
TYPE ID = NUM ;
```

This helps detect similarity when variable names or literal values are changed.

---

### 3. N-Gram Generation

The normalized token sequence is divided into overlapping groups called **n-grams**.

```text
[A, B, C, D, E]

3-grams:

[A, B, C]
[B, C, D]
[C, D, E]
```

CppPlagsChecker uses short and long n-grams to capture similarity at different scales.

---

### 4. Jaccard Similarity

The engine compares generated token sets using Jaccard similarity.

```text
Similarity = Intersection / Union
```

The result ranges from:

```text
0.0 → No detected similarity

1.0 → Identical compared representation
```

---

### 5. Winnowing

Comparing every n-gram can be noisy.

Winnowing selects representative fingerprints from the normalized token stream.

```text
Normalized Tokens
        ↓
Token N-Grams
        ↓
Hashes
        ↓
Sliding Windows
        ↓
Selected Fingerprints
```

These fingerprints help detect matching regions while reducing the amount of data being compared.

---

### 6. Final Decision

The current engine uses the Winnowing similarity score as its final similarity score.

```text
Winnowing Score
       ↓
Compare With Threshold
       ↓
FLAGGED / NOT FLAGGED
```

The default threshold is:

```text
20%
```

The threshold is an experimental project configuration and should not be treated as universal evidence of plagiarism.

---

## 📊 Result Metrics

| Metric | Meaning |
|---|---|
| Similarity Score | Final score used by the current engine |
| N-Gram | Combined short and long n-gram similarity |
| Short | Similarity between short token patterns |
| Long | Similarity between longer token patterns |
| Winnowing | Similarity between selected fingerprints |
| Threshold | Score required to mark the pair as flagged |

---

## 🏗️ Project Structure

```text
CppPlagsChecker/
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── src/
│   │   ├── constants/
│   │   │   └── cpp.constants.js
│   │   │
│   │   ├── core/
│   │   │   └── checkCppSimilarity.js
│   │   │
│   │   ├── services/
│   │   │   ├── evaluation.service.js
│   │   │   ├── frequency.service.js
│   │   │   ├── ngram.service.js
│   │   │   ├── normalizer.service.js
│   │   │   ├── similarity.service.js
│   │   │   ├── tokenizer.service.js
│   │   │   └── winnowing.service.js
│   │   │
│   │   └── server.js
│   │
│   ├── tests/
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
├── README.md
└── USER_MANUAL.md
```

---

## 🧩 Folder Responsibilities

### `frontend/`

Contains the React user interface.

It collects both C++ submissions, sends them to the backend, and displays the returned similarity metrics.

### `server/src/services/`

Contains individual processing algorithms.

Each service has one main responsibility.

| Service | Responsibility |
|---|---|
| `tokenizer.service.js` | Converts C++ source code into tokens |
| `normalizer.service.js` | Normalizes identifiers and selected token categories |
| `ngram.service.js` | Generates token n-grams |
| `similarity.service.js` | Calculates Jaccard similarity |
| `winnowing.service.js` | Generates Winnowing fingerprints |
| `frequency.service.js` | Calculates token-frequency similarity used during experimentation/testing |
| `evaluation.service.js` | Calculates benchmark metrics such as precision and recall |

### `server/src/core/`

Contains the main comparison engine.

`checkCppSimilarity.js` coordinates the individual services and produces the final result.

### `server/tests/`

Contains automated tests and benchmark cases.

The tests verify individual algorithms, complete engine behavior, known transformations, and benchmark classification results.

---

## 🔌 API

### `POST /compare`

Compares two C++ code samples.

### Request

```json
{
  "codeA": "int main() { return 0; }",
  "codeB": "int main() { return 0; }"
}
```

### Response

```json
{
  "flagged": true,
  "similarityScore": 1,
  "diagnostics": {
    "ngramScore": 1,
    "shortScore": 1,
    "longScore": 1,
    "winnowingScore": 1,
    "threshold": 0.2
  }
}
```

---

## 🧪 Testing

The project includes automated tests for:

- Tokenization.
- Normalization.
- Jaccard similarity.
- Token-frequency similarity.
- Winnowing fingerprint generation.
- Complete comparison engine behavior.
- Known source-code transformations.
- Labeled benchmark pairs.

Run the backend test suite:

```bash
cd server
npm test
```

The benchmark dataset includes examples such as:

```text
SHOULD FLAG

Variable renaming
Comment and formatting changes
Literal changes
Dead code insertion
Statement reordering
For-loop rewritten as while-loop


SHOULD NOT FLAG

Sum vs Binary Search
Sorting vs DFS
GCD vs Palindrome
Kadane vs DSU
```

The benchmark is intentionally small and is used for development validation, not as proof of real-world plagiarism detection accuracy.

---

## 💻 Local Setup

### Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL
cd CppPlagsChecker
```

### Start Backend

```bash
cd server
npm install
node src/server.js
```

### Start Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend uses:

```text
VITE_API_URL
```

when configured.

Otherwise, it falls back to:

```text
http://localhost:5000
```

---

## 🚀 Deployment

The application is deployed as two independent services.

```text
GitHub Repository
        │
        ├── server/
        │      ↓
        │    Render
        │      ↓
        │   Backend API
        │
        └── frontend/
               ↓
             Vercel
               ↓
          React Application
```

The frontend receives the deployed backend URL through:

```text
VITE_API_URL
```

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS

### Backend

- Node.js
- Express.js
- CORS

### Similarity Engine

- C++ Tokenization
- Token Normalization
- Token N-Grams
- Jaccard Similarity
- Winnowing Fingerprints

### Testing

- Vitest
- Labeled Benchmark Cases

### Deployment

- GitHub
- Render
- Vercel

---

## ⚠️ Scope and Limitations

CppPlagsChecker measures **source-code similarity**.

It does not prove plagiarism.

Important limitations:

- Independent implementations of the same algorithm may naturally look similar.
- Standard competitive-programming patterns may increase similarity scores.
- The engine does not perform full semantic program analysis.
- The benchmark dataset is small.
- The current threshold was selected for the project's benchmark cases.
- Results should be treated as indicators for human review.

The project is primarily designed for comparing C++ submissions written for the same or closely related programming problems.

---

## 🔮 Possible Improvements

- Larger benchmark dataset.
- Threshold calibration using more labeled submissions.
- Syntax-tree-based structural comparison.
- Control-flow analysis.
- Similarity ranking across multiple submissions.
- Matched-code-region visualization.
- Automated CI testing with GitHub Actions.

---

## 👤 Author

Built as a learning project focused on source-code analysis, similarity algorithms, backend architecture, testing, and deployment.