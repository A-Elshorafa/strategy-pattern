"use client";

import { useEffect, useState } from "react";

type Quote = { method: string; cost: number };

export default function Home() {
  const [methods, setMethods] = useState<string[]>([]);
  const [method, setMethod] = useState("");
  const [weightKg, setWeightKg] = useState("2");
  const [distanceKm, setDistanceKm] = useState("50");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/shipping/methods")
      .then((r) => r.json())
      .then((m: string[]) => {
        setMethods(m);
        setMethod(m[0] ?? "");
      })
      .catch(() => setError("Could not load shipping methods. Is the API running?"));
  }, []);

  async function getQuote(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setQuote(null);
    try {
      const res = await fetch("/api/shipping/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method,
          weightKg: Number(weightKg),
          distanceKm: Number(distanceKm),
        }),
      });
      if (!res.ok) {
        setError((await res.text()).replace(/^"|"$/g, ""));
      } else {
        setQuote(await res.json());
      }
    } catch {
      setError("Request failed. Is the API running?");
    } finally {
      setLoading(false);
    }
  }

  const input =
    "w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500";

  return (
    <main className="flex flex-1 items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-slate-900">Shipping Quote</h1>
        <p className="mb-6 text-sm text-slate-500">
          Strategy pattern demo: the API picks the pricing algorithm from the chosen method.
        </p>

        <form onSubmit={getQuote} className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Method
            <select className={input} value={method} onChange={(e) => setMethod(e.target.value)}>
              {methods.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Weight (kg)
            <input
              className={input}
              type="number"
              min="0"
              step="any"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Distance (km)
            <input
              className={input}
              type="number"
              min="0"
              step="any"
              value={distanceKm}
              onChange={(e) => setDistanceKm(e.target.value)}
            />
          </label>

          <button
            type="submit"
            disabled={loading || !method}
            className="w-full rounded-lg bg-indigo-600 py-2 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Calculating..." : "Get quote"}
          </button>
        </form>

        {quote && (
          <div className="mt-6 rounded-lg bg-emerald-50 p-4 text-emerald-800">
            <span className="capitalize">{quote.method}</span> shipping:{" "}
            <span className="text-xl font-bold">${quote.cost.toFixed(2)}</span>
          </div>
        )}
        {error && <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-700">{error}</div>}
      </div>
    </main>
  );
}
