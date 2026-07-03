"use client";
import { useState } from "react";
import EstimatedVisitsChart from '@/components/EstimatedVisitsChart'
import TopCountries from '@/components/TopCountriesChart'
import SiteInfo from '@/components/SiteInfo'
import Ranks from '@/components/Ranks'

export default function FullTrafficDashboard() {
  const [domain, setDomain] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTraffic = async () => {
    if (!domain.trim()) return;
    setLoading(true);
    setError("");
    setData(null);

    const url = `/api/traffic?domain=${encodeURIComponent(domain.trim())}`;

    try {
      const response = await fetch(url);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch traffic data.");
      }

      setData(result);
    } catch (err) {
      console.error("Client Dash Error:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return "-";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  }

  function formatNumber(val) {
    if (val >= 1_000_000_000) return (val / 1_000_000_000).toFixed(1) + "B";
    if (val >= 1_000_000) return (val / 1_000_000).toFixed(1) + "M";
    if (val >= 1_000) return (val / 1_000).toFixed(0) + "k";
    return val?.toString() || "-";
  }

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen p-6">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold mb-6">Website Traffic Checker</h1>

        <div className="flex gap-3 w-full max-w-xl items-center">
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="Enter domain (e.g. x.com)"
            className="flex-1 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
          />
          <button
            onClick={fetchTraffic}
            disabled={loading}
            className="px-5 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 rounded-lg text-white font-medium transition-colors"
          >
            {loading ? "Checking..." : "Check"}
          </button>
        </div>
      </div>

      {loading && <p className="text-slate-400 text-center text-lg animate-pulse">Loading traffic data...</p>}
      {error && <p className="text-red-400 text-center bg-red-950/40 max-w-xl mx-auto p-3 rounded-lg border border-red-900/50 mb-6">{error}</p>}

      {data && (
        <div className="space-y-10 max-w-5xl mx-auto">
          <SiteInfo data={data} />
          
          <section>
            <h2 className="text-xl font-semibold text-amber-400 mb-2">Engagement</h2>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Metric label="Monthly Visits" value={formatNumber(data.Engagments?.Visits)} />
              <Metric label="Bounce Rate" value={data.Engagments?.BounceRate ? `${(parseFloat(data.Engagments.BounceRate) * 100).toFixed(1)}%` : "-"} />
              <Metric label="Pages / Visit" value={data.Engagments?.PagePerVisit ? parseFloat(data.Engagments.PagePerVisit).toFixed(2) : "-"} />
              <Metric label="Avg Time on Site" value={formatTime(data.Engagments?.TimeOnSite)} />
              <Metric label="Month" value={data.Engagments?.Month} />
              <Metric label="Year" value={data.Engagments?.Year} />
            </ul>
          </section>

          <Ranks data={data} />
          <EstimatedVisitsChart visitsData={data.EstimatedMonthlyVisits} />

          <section>
            <h2 className="text-xl font-semibold text-amber-400 mb-2">Traffic Sources</h2>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(data.TrafficSources || {}).map(([source, value], i) => (
                <Metric key={i} label={source} value={`${(value * 100).toFixed(2)}%`} />
              ))}
            </ul>
          </section>

          <TopCountries countries={data.Countries} topCountryShares={data.TopCountryShares} />

          <section>
            <h2 className="text-xl font-semibold text-amber-400 mb-2">Top Keywords</h2>
            <div className="overflow-x-auto border border-slate-700 rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-slate-800 text-slate-300">
                  <tr>
                    <th className="p-3 text-left">Keyword</th>
                    <th className="p-3 text-right">Volume</th>
                    <th className="p-3 text-right">CPC</th>
                    <th className="p-3 text-right">Est. Value</th>
                  </tr>
                </thead>
                <tbody>
                  {data.TopKeywords?.map((k, i) => (
                    <tr key={i} className="border-t border-slate-700 hover:bg-slate-800/50">
                      <td className="p-3 font-medium text-slate-200">{k?.Name || "-"}</td>
                      <td className="p-3 text-right text-slate-300">{k?.Volume != null ? k.Volume.toLocaleString() : "-"}</td>
                      <td className="p-3 text-right text-emerald-400">{k?.Cpc != null ? `$${Number(k.Cpc).toFixed(2)}` : "-"}</td>
                      <td className="p-3 text-right text-cyan-400">{k?.EstimatedValue != null ? `$${Number(k.EstimatedValue).toFixed(2)}` : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {data.LargeScreenshot && (
            <section>
              <h2 className="text-xl font-semibold text-amber-400 mb-2">Screenshot</h2>
              <img src={data.LargeScreenshot} alt="Site Screenshot" className="rounded-lg border border-slate-700 w-full h-auto object-cover max-h-[500px]" />
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
      <div className="text-sm text-slate-400 mb-1">{label}</div>
      <div className="text-lg font-bold text-white">{value || "-"}</div>
    </div>
  );
}
