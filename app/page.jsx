"use client";
import { useState } from "react";
import EstimatedVisitsChart from '@/components/EstimatedVisitsChart'
import TopCountriesChart from '@/components/TopCountriesChart'

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

    const url = `https://similarweb-traffic.p.rapidapi.com/traffic?domain=${domain}`;
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": "4b7c6d58fbmshe4fa6c2cf4656b5p1cf76djsn3c6c2ded85c6",
        "x-rapidapi-host": "similarweb-traffic.p.rapidapi.com",
      },
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to fetch traffic data.");
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
      <div className="justify-items-center">

        <h1 className="text-3xl font-bold mb-6">Website Traffic Checker</h1>

        <div className="flex gap-3 max-w-xl mb-6 align-center">
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="Enter domain (e.g. x.com)"
            className="flex-1 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <button
            onClick={fetchTraffic}
            className="px-5 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white"
          >
            Check
          </button>
        </div>
      </div>

      {loading && <p className="text-slate-400 text-center">Loading traffic data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {data && (
        <div className="space-y-10 max-w-5xl mx-auto">
          {/* Site Info */}
          <section>
            <h2 className="text-xl font-semibold text-amber-400 mb-2">Site Info</h2>
            <ul className="space-y-1">
              <li><strong>Site Name:</strong> {data.SiteName}</li>
              <li><strong>Description:</strong> {data.Description}</li>
              <li><strong>Category:</strong> {data.Category}</li>
              <li><strong>Snapshot Date:</strong> {data.SnapshotDate}</li>
              <li><strong>Title:</strong> {data.Title}</li>
            </ul>
          </section>

          {/* Engagement */}
          <section>
            <h2 className="text-xl font-semibold text-amber-400 mb-2">Engagement</h2>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Metric
                label="Monthly Visits"
                value={formatNumber(data.Engagments?.Visits)}
              />

              <Metric label="Bounce Rate" value={`${(parseFloat(data.Engagments?.BounceRate) * 100).toFixed(1)}%`} />
              <Metric label="Pages / Visit" value={parseFloat(data.Engagments?.PagePerVisit).toFixed(2)} />
              <Metric
                label="Avg Time on Site"
                value={formatTime(data.Engagments?.TimeOnSite)}
              />
              <Metric label="Month" value={data.Engagments?.Month} />
              <Metric label="Year" value={data.Engagments?.Year} />
            </ul>
          </section>

          {/* Ranks */}
          <section>
            <h2 className="text-xl font-semibold text-amber-400 mb-2">Ranks</h2>
            <ul className="space-y-1">
              <li><strong>Global Rank:</strong> #{data.GlobalRank?.Rank}</li>
              <li><strong>Country Rank:</strong> #{data.CountryRank?.Rank} ({data.CountryRank?.CountryCode})</li>
              <li><strong>Category Rank:</strong> #{data.CategoryRank?.Rank}</li>
            </ul>
          </section>

          {/* Estimated Monthly Visits */}
          <EstimatedVisitsChart visitsData={data.EstimatedMonthlyVisits} />

          {/* Traffic Sources */}
          <section>
            <h2 className="text-xl font-semibold text-amber-400 mb-2">Traffic Sources</h2>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(data.TrafficSources || {}).map(([source, value], i) => (
                <Metric key={i} label={source} value={`${(value * 100).toFixed(2)}%`} />
              ))}
            </ul>
          </section>

          {/* Top Countries */}
          <TopCountriesChart countries={data.TopCountryShares} />


          {/* Top Keywords */}
          <section>
            <h2 className="text-xl font-semibold text-amber-400 mb-2">Top Keywords</h2>
            <table className="w-full text-sm border border-slate-700">
              <thead className="bg-slate-800 text-slate-300">
                <tr>
                  <th className="p-2 text-left">Keyword</th>
                  <th className="p-2 text-right">Volume</th>
                  <th className="p-2 text-right">CPC</th>
                  <th className="p-2 text-right">Est. Value</th>
                </tr>
              </thead>
              <tbody>
                {data.TopKeywords?.map((k, i) => (
                  <tr key={i} className="border-t border-slate-700">
                    <td className="p-2">{k.Name}</td>
                    <td className="p-2 text-right">{k.Volume.toLocaleString()}</td>
                    <td className="p-2 text-right">{k.Cpc ? `$${k.Cpc.toFixed(2)}` : "-"}</td>
                    <td className="p-2 text-right">${k.EstimatedValue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Screenshot */}
          {data.LargeScreenshot && (
            <section>
              <h2 className="text-xl font-semibold text-amber-400 mb-2">Screenshot</h2>
              <img
                src={data.LargeScreenshot}
                alt="Site Screenshot"
                className="rounded-lg border border-slate-700"
              />
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
      <div className="text-sm text-slate-400">{label}</div>
      <div className="text-lg font-bold">{value || "-"}</div>
    </div>
  );
}
