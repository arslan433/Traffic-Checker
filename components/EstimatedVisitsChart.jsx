"use client";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

export default function EstimatedVisitsChart({ visitsData }) {

  const categories = Object.keys(visitsData || {});
  const values = Object.values(visitsData || {});

  const options = {
    chart: {
      type: "line",
      backgroundColor: "#0f172a",
      style: { fontFamily: "Inter, sans-serif" },
    },
    title: {
      text: "Estimated Monthly Visits",
      style: { color: "#facc15", fontSize: "18px" },
    },
    xAxis: {
      categories,
      labels: { style: { color: "#e2e8f0" } },
    },
    yAxis: {
      title: { text: "Visits", style: { color: "#e2e8f0" } },
      labels: {
        style: { color: "#94a3b8" },
        formatter: function () {
          if (this.value >= 1_000_000) return (this.value / 1_000_000).toFixed(1) + "M";
          if (this.value >= 1_000) return (this.value / 1_000).toFixed(0) + "k";
          return this.value;
        },
      },
      gridLineColor: "#1e293b",
    },
    series: [
      {
        name: "Visits",
        data: values,
        color: "#3b82f6",
        marker: { enabled: true, radius: 4 },
      },
    ],
    tooltip: {
      backgroundColor: "#1e293b",
      style: { color: "#f1f5f9" },
      formatter: function () {
        let val = this.y;
        if (val >= 1_000_000) val = (val / 1_000_000).toFixed(1) + "M";
        else if (val >= 1_000) val = (val / 1_000).toFixed(0) + "k";
        return `<b>${this.x}</b>: ${val}`;
      },
    },
    credits: { enabled: false },
  };

  return (
    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}
