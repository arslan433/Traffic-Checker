"use client";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

function getRandomColors(count) {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const color = "#" + Math.floor(Math.random() * 16777215).toString(16);
    colors.push(color);
  }
  return colors;
}

export default function TopCountriesVerticalChart({ countries }) {
  const top5 = (countries || []).slice(0, 5).map(c => ({
    name: c.CountryCode,
    y: +(c.Value * 100).toFixed(2),
  }));


  const options = {
    chart: {
      type: "column",
      backgroundColor: "#0f172a",
      height: 320,
    },
    title: {
      text: "Top Countries by Traffic Share",
      style: { color: "#facc15", fontSize: "18px" },
    },
    xAxis: {
      categories: top5.map(c => c.name),
      title: { text: null },
      labels: { style: { color: "#e2e8f0" } },
    },
    yAxis: {
      min: 0,
      title: {
        text: "Traffic Share (%)",
        style: { color: "#e2e8f0" },
      },
      labels: {
        style: { color: "#94a3b8" },
        formatter: function () {
          return this.value + "%";
        },
      },
      gridLineColor: "#1e293b",
    },
    legend: { enabled: false },
    tooltip: {
      backgroundColor: "#1e293b",
      style: { color: "#f1f5f9" },
      pointFormat: "<b>{point.y:.2f}%</b> traffic share",
    },
    series: [
      {
        name: "Traffic Share",
        data: top5,
        colorByPoint: true,
       colors: getRandomColors(top5.length), 
        dataLabels: {
          enabled: true,
          format: "{point.y:.2f}%",
          style: {
            color: "#f1f5f9",
            fontWeight: "bold",
          },
        },
      },
    ],
    credits: { enabled: false },
  };

  return (
    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}
