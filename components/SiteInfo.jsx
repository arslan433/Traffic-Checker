import { Link, Info, Grid, Calendar, Tag } from "lucide-react";

export default function SiteInfo({ data }) {
  function formatCategory(cat) {
  if (!cat) return "N/A";
  return cat
    .split("/")
    .map(c =>
      c.replace(/_/g, " ")
       .replace(/\b\w/g, l => l.toUpperCase())
    )
    .join(" › ");
}

  return (
    <section className="bg-slate-800 p-4 rounded-lg border border-slate-700">
      <h2 className="text-xl font-semibold text-amber-400 mb-4 flex items-center gap-2">
        <Info className="w-5 h-5 text-amber-400" />
        Site Info
      </h2>

      <ul className="space-y-3 text-slate-200">
        <li className="flex items-start gap-3">
          <span className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-700 text-slate-300">
            <Link className="w-4 h-4" />
          </span>
          <div>
            <p className="text-sm text-slate-400">Site Name</p>
            <p className="font-medium">{data.SiteName}</p>
          </div>
        </li>

        <li className="flex items-start gap-3">
          <span className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-700 text-slate-300">
            <Info className="w-4 h-4" />
          </span>
          <div>
            <p className="text-sm text-slate-400">Description</p>
            <p className="font-medium">{data.Description}</p>
          </div>
        </li>

        <li className="flex items-start gap-3">
          <span className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-700 text-slate-300">
            <Grid className="w-4 h-4" />
          </span>
          <div>
            <p className="text-sm text-slate-400">Category</p>
          <p className="font-medium">{formatCategory(data.Category)}</p>
          </div>
        </li>

        <li className="flex items-start gap-3">
          <span className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-700 text-slate-300">
            <Calendar className="w-4 h-4" />
          </span>
          <div>
            <p className="text-sm text-slate-400">Snapshot Date</p>
            <p className="font-medium">
              {new Date(data.SnapshotDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </li>

        <li className="flex items-start gap-3">
          <span className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-700 text-slate-300">
            <Tag className="w-4 h-4" />
          </span>
          <div>
            <p className="text-sm text-slate-400">Title</p>
            <p className="font-medium">{data.Title}</p>
          </div>
        </li>
      </ul>
    </section>
  );
}
