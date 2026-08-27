import React, { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function MetricCard({ title, value }) {
    return (
        <article className="rounded-xl border border-white/10 bg-slate-800/30 p-4 shadow-xl shadow-black/10 backdrop-blur-2xl transition hover:-translate-y-0.5 hover:border-cyan-300/20 hover:bg-slate-800/45">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                {title}
            </p>
            <p className="mt-2 text-xl font-semibold text-slate-100">
                {(Number(value ?? 0)*100).toFixed(1)}%
            </p>
        </article>
    );
}

function CodeEditor({ label, subtitle, value, onChange, accent }) {
    const focusColor =
        accent === "cyan" ? "focus:ring-cyan-400/20" : "focus:ring-blue-400/20";

    return (
        <article className="overflow-hidden rounded-2xl border border-white/10 bg-[#050914] shadow-xl shadow-black/20 transition duration-300 hover:border-blue-300/20">
            <div className="flex items-center justify-between border-b border-white/10 bg-slate-800/70 px-4 py-3 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-slate-700/50 text-sm font-semibold text-slate-200">
                        {label}
                    </span>

                    <div>
                        <h3 className="text-sm font-medium text-slate-100 sm:text-base">
                            Source Code {label}
                        </h3>
                        <p className="text-xs text-slate-400">
                            {subtitle}
                        </p>
                    </div>
                </div>
                <span className="rounded-lg border border-white/10 bg-slate-950/40 px-2.5 py-1 font-mono text-xs text-slate-400">
                    C++
                </span>

            </div>
            <textarea
                value={value} onChange={(event) => onChange(event.target.value)} spellCheck={false} placeholder={`// Paste C++ code ${label} here...`} className={`block h-[300px] w-full resize-y bg-transparent p-4 font-mono text-xs leading-6 text-slate-200 caret-cyan-400 outline-none placeholder:text-slate-600 focus:ring-1 focus:ring-inset ${focusColor} sm:h-[380px] sm:text-sm lg:h-[430px]`}
            />
        </article>
    );
}

function App() {
    const [codeA, setCodeA] = useState("");
    const [codeB, setCodeB] = useState("");

    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [benchmarkResult, setBenchmarkResult] = useState(null);
    const [benchmarkLoading, setBenchmarkLoading] = useState(false);
    const [selectedBenchmark, setSelectedBenchmark] = useState(null);

    async function compareCodes() {
        setError("");
        if (!codeA.trim() || !codeB.trim()) {
            setResult(null);
            setError("Both C++ code samples are required.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/compare`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    codeA,
                    codeB
                })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(
                    data.error || "Code comparison failed."
                );
            }

            setResult(data);
        } catch (requestError) {
            setResult(null);
            setError(
                requestError.message ||
                "Unable to connect to the comparison server."
            );
        } finally {
            setLoading(false);
        }
    }
async function runBenchmark() {
    console.log("BENCHMARK BUTTON CLICKED");

    setError("");
    setBenchmarkLoading(true);

    try {
        const response = await fetch(`${API_URL}/benchmark`);
        console.log("BENCHMARK RESPONSE:", response.status);
        const data = await response.json();
        console.log("BENCHMARK DATA:", data);
        if (!response.ok) {
            throw new Error(
                data.error || "Benchmark failed."
            );
        }
        setBenchmarkResult(data);
    } catch (requestError) {
        console.error("BENCHMARK ERROR:", requestError);

        setBenchmarkResult(null);
        setError(
            requestError.message ||
            "Unable to connect to the benchmark server."
        );
    } finally {
        setBenchmarkLoading(false);
    }
}
    const score = Number(result?.similarityScore ?? 0);
    const diagnostics = result?.diagnostics;

    return (
        <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-slate-200 antialiased">

            <div className="pointer-events-none fixed inset-0 overflow-hidden">

                <div className="absolute -left-48 -top-40 h-[650px] w-[650px] rounded-full bg-blue-500/10 blur-[150px]" />

                <div className="absolute -right-52 top-[20%] h-[600px] w-[600px] rounded-full bg-cyan-400/[0.07] blur-[160px]" />

                <div className="absolute bottom-[-250px] left-[25%] h-[600px] w-[700px] rounded-full bg-indigo-500/[0.07] blur-[170px]" />
                <div
                    className="absolute inset-0 opacity-[0.035]"
                    style={{
                        backgroundImage:"linear-gradient(rgba(148,163,184,.45) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,.45) 1px, transparent 1px)",
                        backgroundSize: "48px 48px"
                    }}
                />

            </div>
            <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/65 shadow-lg shadow-black/10 backdrop-blur-2xl">

                <nav className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-300/20 bg-blue-400/10 shadow-lg shadow-blue-500/10">
                            <span className="bg-gradient-to-br from-green-300 to-cyan-300 bg-clip-text font-mono text-xs font-bold text-transparent">
                                C++
                            </span>
                        </div>

                        <div>
                            <h1 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
                                PlagsChecker
                            </h1>

                            <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
                                C++ similarity analysis
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <a href="/user-manual.html" target="_blank" rel="noopener noreferrer"
                            className="text-white items-center gap-2 rounded-full border border-cyan-400/30 bg-gradient-to-r from-violet-600 to-cyan-500 hover:scale-105 transition-all duration-300 px-2 py-2 sm:flex">
                            User Manual
                        </a>
        
                        <div className="flex items-center gap-2">
                            <div className="hidden items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/[0.07] px-3 py-2 sm:flex">                        
                                C++ Only
                            </div>
                        </div>
                    </div>
                    
                </nav>
            </header>

            <main className="relative mx-auto w-full max-w-[1500px] px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
                <section className="relative mb-5 overflow-hidden rounded-2xl border border-white/10 bg-slate-800/35 p-5 shadow-2xl shadow-black/15 backdrop-blur-2xl sm:p-6">
                    <div className="absolute -right-20 -top-28 h-64 w-64 rounded-full bg-blue-400/10 blur-[90px]" />

                    <div className="relative">
                        <span className="inline-flex rounded-full border border-blue-300/20 bg-blue-400/[0.07] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-200/80">
                            Source Analysis
                        </span>
                        <h2 className="mt-3 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                            Compare C++ submissions of a problem
                        </h2>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                            Analyze structural similarity using normalized tokens,
                            n-gram matching, and Winnowing fingerprints.
                        </p>

                    </div>
                    <div className="mt-6 grid gap-4 md:grid-cols-2">


                    <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-5">
                        <p className="text-m font-semibold text-slate-100">
                            Test on predefined cases
                        </p>

                        <p className="mt-2 text-sm leading-6 text-slate-300">
                            <span className="font-semibold">Don't </span>
                            have two C++ submissions?
                            Run the built-in benchmark to test the
                            detector on 10 predefined cases.
                        </p>

                        <button
                            type="button"
                            onClick={runBenchmark}
                            disabled={benchmarkLoading}
                            className="rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-5 py-2.5 text-sm font-medium text-cyan-300 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {benchmarkLoading
                                ? "Running Benchmark..."
                                : "Run Benchmark"}
                        </button>
                    </div>

                    
                    <div className="rounded-xl border border-amber-300/20 bg-amber-300/5 p-5">
                        <p className="text-m font-semibold text-amber-300">
                            Important
                        </p>

                        <p className="mt-2 text-sm leading-6 text-slate-300">
                            Very short code can produce high similarity
                            scores by coincidence. Treat flags as a
                            review signal, not proof of plagiarism.
                        </p>
                    </div>

                    

                </div>
                {benchmarkResult && (
                    <div className="mt-6 rounded-xl border border-slate-700 bg-slate-900/50 p-6">

                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-white/80">
                                Benchmark Results on predefined testcases
                            </h2>
                            <span className="text-sm font-semibold text-slate-300/80">
                                {benchmarkResult.totalCases} test cases
                            </span>
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-5 md:grid-cols-4">

                            <div>
                                <p className="text-sm font-semibold text-slate-300/80">
                                    Precision
                                </p>
                                <p className="mt-1 text-2xl font-semibold text-cyan-300">
                                    ~{(benchmarkResult.metrics.precision * 100).toFixed(0)}%
                                </p>
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-slate-300/80">
                                    Recall
                                </p>
                                <p className="mt-1 text-2xl font-semibold text-cyan-300">
                                    ~{(benchmarkResult.metrics.recall * 100).toFixed(0)}%
                                </p>
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-slate-300/80">
                                    F1 Score
                                </p>
                                <p className="mt-1 text-2xl font-semibold text-cyan-300">
                                    ~{(benchmarkResult.metrics.f1 * 100).toFixed(0)}%
                                </p>
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-slate-300/80">
                                    Cases Passed
                                </p>
                                <p className="mt-1 text-2xl font-semibold text-white">
                                    {
                                        benchmarkResult.results.filter(
                                            (test) => test.passed
                                        ).length
                                    }/{benchmarkResult.totalCases}
                                </p>
                            </div>

                        </div>

                        <div className="mt-6 border-t border-slate-700 pt-5">
                            <h3 className="w-fit h-fit border rounded-xl border-slate-700 p-2 bg-gradient-to-r from-blue-500/80 to-purple-500/80 text-sm font-semibold text-slate-300">
                                Click on testcases to view the code
                            </h3>

                            <div className="mt-3 space-y-2">

                                <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                                {benchmarkResult.results.map((testCase) => (
                                    <React.Fragment key={testCase.name}>
                                    <div key={testCase.name}
                                        onClick={() =>
                                            setSelectedBenchmark(
                                                selectedBenchmark === testCase.name ? null : testCase.name
                                            )
                                        }
                                        className="cursor-pointer rounded-lg border border-slate-800 bg-slate-950/40 px-4 py-3 transition hover:border-slate-600"
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className={ testCase.passed? "text-emerald-400": "text-red-400" }
                                                >
                                                    {testCase.passed ? "✓" : "✕"}
                                                </span>

                                                <span className="text-sm text-slate-300">
                                                    {testCase.name}
                                                </span>
                                            </div>

                                            <span
                                                className={
                                                    testCase.expected === "SHOULD_FLAG"? "text-xs text-amber-300/90": "text-xs text-green-400/90"
                                                }
                                            >
                                                {testCase.expected === "SHOULD_FLAG"? "SHOULD FLAG": "SHOULD NOT FLAG"}
                                            </span>
                                        </div>

                                        <div className="mt-2 ml-7 flex gap-5 text-xs text-slate-500">
                                            <span>
                                                N-gram: {(testCase.ngramScore * 100).toFixed(1)}%
                                            </span>
                                            <span>
                                                Winnowing: {(testCase.winnowingScore * 100).toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {selectedBenchmark === testCase.name && (
                                            <div className="col-span-full grid gap-3 md:grid-cols-2">

                                                <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
                                                    <div className="border-b border-slate-800 px-4 py-2">
                                                        <span className="text-sm font-medium text-slate-300">
                                                            Code A
                                                        </span>
                                                    </div>

                                                    <pre className="max-h-80 overflow-auto p-4 text-xs leading-5 text-slate-400">
                                                        <code>{testCase.codeA}</code>
                                                    </pre>
                                                </div>

                                                <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
                                                    <div className="border-b border-slate-800 px-4 py-2">
                                                        <span className="text-sm font-medium text-slate-300">
                                                            Code B
                                                        </span>
                                                    </div>

                                                    <pre className="max-h-80 overflow-auto p-4 text-xs leading-5 text-slate-400">
                                                        <code>{testCase.codeB}</code>
                                                    </pre>
                                                </div>

                                            </div>
                                        )}
                                    </React.Fragment>   
                                ))}
                                </div>
                            </div>

                        </div>

                    </div>
                )}

                </section>

                
                <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">

                    <CodeEditor
                        label="A" subtitle="First submission" value={codeA} onChange={setCodeA} accent="blue"
                    />

                    <CodeEditor label="B" subtitle="Second submission" value={codeB} onChange={setCodeB} accent="cyan"
                    />

                </section>

                <section className="mt-4 flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-800/30 p-4 shadow-xl shadow-black/15 backdrop-blur-2xl sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-200">
                            Ready to analyze
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                            Submit both code samples to calculate similarity metrics.
                        </p>
                    </div>

                    <button
                        onClick={compareCodes}
                        disabled={loading}
                        className="w-full shrink-0 rounded-xl border border-blue-300/20 bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/15 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/25 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                    >
                        {loading ? "Analyzing..." : "Compare Codes"}
                    </button>

                </section>

                {error && (
                    <div className="mt-4 rounded-xl border border-red-300/20 bg-red-400/[0.07] px-4 py-3 text-sm text-red-200 backdrop-blur-2xl">
                        {error}
                    </div>
                )}

                {result && (
                    <section className="mt-7">
                        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">

                            <div>
                                <h2 className="text-base font-semibold text-slate-100">
                                    Analysis Results
                                </h2>

                                <p className="mt-1 text-xs text-slate-400">
                                    Similarity metrics generated by the comparison engine.
                                </p>
                            </div>

                            <span
                                className={
                                    result.flagged
                                        ? "rounded-full border border-red-300/20 bg-red-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-red-300"
                                        : "rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-300"
                                }
                            >
                                {result.flagged ? "Flagged" : "Not Flagged"}
                            </span>

                        </div>


                        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-800/30 p-5 shadow-2xl shadow-black/15 backdrop-blur-2xl">
                            <div className="grid gap-5 md:grid-cols-[220px_1fr] md:items-center">
                                <div>
                                    <p className="text-sm font-medium text-slate-400">
                                        Similarity Score
                                    </p>

                                    <p className="mt-2 text-4xl font-semibold tracking-tight text-white">
                                        {(score * 100).toFixed(1)}%
                                    </p>
                                </div>
                                <div>

                                    <div className="mb-2 flex justify-between text-xs text-slate-400">
                                        <span>0.00</span>

                                        <span>
                                            Threshold: {(Number(diagnostics.threshold) * 100).toFixed(1)}%
                                        </span>

                                        <span>1.00</span>
                                    </div>

                                    <div className="h-2 overflow-hidden rounded-full bg-slate-950/60">

                                        <div
                                            className={
                                                result.flagged
                                                    ? "h-full rounded-full bg-gradient-to-r from-orange-400 to-red-400 transition-all duration-700"
                                                    : "h-full rounded-full bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300 transition-all duration-700"
                                            }
                                            style={{
                                                width: `${Math.min(100, Math.max(0, score * 100))}%`
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">

                            <MetricCard
                                title="N-Gram"
                                value={diagnostics.ngramScore}
                            />

                            <MetricCard
                                title="Short"
                                value={diagnostics.shortScore}
                            />

                            <MetricCard
                                title="Long"
                                value={diagnostics.longScore}
                            />

                            <MetricCard
                                title="Winnowing"
                                value={diagnostics.winnowingScore}
                            />

                            <MetricCard
                                title="Threshold"
                                value={diagnostics.threshold}
                            />

                        </div>

                    </section>
                )}

            </main>
            <footer className="relative mt-8 border-t border-white/[0.06] bg-slate-950/30 backdrop-blur-xl">
                <div className="mx-auto max-w-[1500px] px-4 py-5 text-xs text-slate-500 sm:px-6 lg:px-8">
                    C++ code similarity analysis using normalization, token n-grams, and Winnowing fingerprints.
                </div>

            </footer>
        </div>
    );
}

export default App;