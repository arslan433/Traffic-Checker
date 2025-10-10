import { Globe, Flag, BarChart3 } from "lucide-react";

export default function Ranks({ data }) {
  return (
    <section className="bg-slate-800 p-4 rounded-lg border border-slate-700">
      <h2 className="text-xl font-semibold text-amber-400 mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-amber-400" />
        Ranks
      </h2>

      <ul className="space-y-3 text-slate-200">
        {/* Global Rank */}
        <li className="flex items-center gap-3">
          <span className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-700 text-slate-300">
            <Globe className="w-4 h-4" />
          </span>
          <div>
            <p className="text-sm text-slate-400">Global Rank</p>
            <p className="font-medium">
              {data.GlobalRank?.Rank ? `#${data.GlobalRank.Rank}` : "N/A"}
            </p>
          </div>
        </li>

        {/* Country Rank */}
        <li className="flex items-center gap-3">
          <span className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-700 text-slate-300">
            <Flag className="w-4 h-4" />
          </span>
          <div>
            <p className="text-sm text-slate-400">Country Rank</p>
            <p className="font-medium">
              {data.CountryRank?.Rank
                ? `#${data.CountryRank.Rank} (${data.CountryRank.CountryCode || "-"})`
                : "N/A"}
            </p>
          </div>
        </li>

        {/* Category Rank */}
        <li className="flex items-center gap-3">
          <span className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-700 text-slate-300">
            <BarChart3 className="w-4 h-4" />
          </span>
          <div>
            <p className="text-sm text-slate-400">Category Rank</p>
            <p className="font-medium">
              {data.CategoryRank?.Rank ? `#${data.CategoryRank.Rank}` : "N/A"}
            </p>
          </div>
        </li>
      </ul>
    </section>
  );
}
