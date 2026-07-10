# 📘 CppPlagsChecker User Manual

CppPlagsChecker compares two C++ code submissions and shows how similar their code structures are.

No technical knowledge of the internal algorithms is required to use the application.

---

## 🎯 What Does the Tool Do?

You provide:

```text
C++ Code A

and

C++ Code B
```

The application analyzes both submissions and returns:

```text
Similarity Percentage

Detailed Similarity Metrics

FLAGGED / NOT FLAGGED Result
```

---

## 🚀 Open the Application

Open the deployed CppPlagsChecker website in your browser.

You will see two code editors:

```text
Source Code A

Source Code B
```

---

## 📝 Step 1: Paste the First Code

Paste the first C++ submission into:

```text
Source Code A
```

---

## 📝 Step 2: Paste the Second Code

Paste the second C++ submission into:

```text
Source Code B
```

Both code editors must contain code before comparison.

---

## 🔍 Step 3: Compare the Codes

Click:

```text
Compare Codes
```

The application sends both submissions to the comparison engine.

After processing, the results appear below the button.

---

## 📊 Understanding the Result

### Similarity Score

The main percentage shows the final similarity score.

Example:

```text
Similarity Score

58.8%
```

A larger percentage means the engine found more matching code patterns.

A high score does not automatically prove plagiarism.

---

## 🚩 FLAGGED

```text
FLAGGED
```

means the final similarity score reached or exceeded the configured threshold.

The pair may require manual review.

---

## ✅ NOT FLAGGED

```text
NOT FLAGGED
```

means the final similarity score remained below the configured threshold.

This does not guarantee that the submissions are completely unrelated.

---

## 📈 Detailed Metrics

The application also displays several internal scores.

| Metric | Simple Meaning |
|---|---|
| N-Gram | Similarity between groups of code tokens |
| Short | Similarity between smaller code patterns |
| Long | Similarity between longer code patterns |
| Winnowing | Similarity between selected code fingerprints |
| Threshold | Minimum score required for a flagged result |

You do not need to calculate these values manually.

They are provided to make the comparison result easier to inspect.

---

## 🧪 Example

Suppose two submissions contain the same logic, but:

```text
Variables were renamed

Comments were removed

Formatting was changed
```

The engine may still detect a high similarity score because it compares normalized code patterns rather than only raw text.

---

## ⚠️ Important Limitations

CppPlagsChecker is a similarity analysis tool.

It should not be used as the only evidence for accusing someone of plagiarism.

Two programmers solving the same problem may independently write similar code.

Standard algorithms and common programming patterns can also increase similarity scores.

Use the result as:

```text
Similarity Indicator
        ↓
Manual Review
        ↓
Final Decision
```

---

## ❓ Common Problems

### Both code samples are required

One or both code editors are empty.
Paste C++ code into both editors and try again.

### Unable to connect to the comparison server

The backend service may be temporarily unavailable or starting after inactivity.
Wait briefly and try again.

### The result seems too high

Similar algorithms and common code structures may produce matching patterns.
Review the detailed metrics and inspect both submissions manually.

### The result seems too low

Large structural changes, different algorithms, or heavily modified code can reduce similarity.
The engine does not perform complete semantic program analysis.

---

## 🔐 Privacy Note

CppPlagsChecker sends the two submitted code samples to the deployed backend for comparison.

The current application does not provide user accounts or persistent submission storage.

Avoid submitting private or confidential source code to any public deployment unless you trust the deployment operator.

---

## 📌 Recommended Use

CppPlagsChecker is best used to:

- Compare C++ submissions for the same programming problem.
- Explore source-code similarity algorithms.
- Identify pairs that may deserve manual inspection.
- Understand how code transformations affect similarity scores.

The final decision should always involve human review.