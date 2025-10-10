"use client";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

function getRandomColors(count) {
  return Array.from({ length: count }, () =>
    "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")
  );
}



function mapCountrySharesWithNames(topShares, countries) {
  return (topShares || []).map(c => {
    const match = (countries || []).find(cc => cc.Code === c.CountryCode);
    return {
      name: match ? match.Name : c.CountryCode,
      y: +(c.Value * 100).toFixed(2),
    };
  });
}

export default function TopCountries({ countries, topCountryShares }) {
  const top5 = mapCountrySharesWithNames(topCountryShares, countries);

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
      labels: { style: { color: "#e2e8f0" } },
    },
    yAxis: {
      min: 0,
      title: { text: "Traffic Share (%)", style: { color: "#e2e8f0" } },
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
      formatter: function () {
        return `<b>${this.point.name}</b>: ${this.y.toFixed(2)}% `;
      },
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
          style: { color: "#f1f5f9", fontWeight: "bold" },
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
