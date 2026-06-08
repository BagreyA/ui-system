import React, { useEffect, useRef } from "react";
import uPlot from "uplot";
import "uplot/dist/uPlot.min.css";

export default function UPlotGraph({ width, height, series, type = "line", xLabel= "", yLabel= "" }) {
  const containerRef = useRef();
  const plotRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    let options, yData;

    // --- Функция для фильтрации меток на оси X ---
    const filterTicks = (vals) => {
      if (!vals) return [];
      const maxTicks = Math.floor(width / 60); // ~50px на метку
      const step = Math.ceil(vals.length / maxTicks);
      return vals.map((v, i) => (i % step === 0 ? v : ""));
    };

    if (type === "line" || type === "bar" || type === "multiLine") {
      options = {
        width,
        height,
        scales: { x: { time: false }, y: { auto: true } },
        axes: [
          {
            stroke: "#878787",
            grid: { show: true },
            font: "10px sans-serif",
            values: (u, vals) => filterTicks(vals),
            rotate: 45, // поворот меток X
            size: 40,   // место под метки
          },
          { stroke: "#878787",
            grid: { show: true },
            size: 130,             // увеличиваем отступ, чтобы текст не примыкал к графику
            font: "12px sans-serif",},
        ],
        series: type === "multiLine"
          ? [
              {}, // X
              ...(series.data?.map((_, idx) => ({
                label: `UE${idx + 1}`,
                stroke: "#00A7C1",
                width: 1.5,
                alpha: 0.3,
              })) || []),
              series.avgData
                ? {
                    label: series.avgLabel || "Average SINR",
                    stroke: "#FF0000",
                    width: 2,
                    dash: [5, 5],
                  }
                : {},
            ]
          : [
              {},
              {
                label: series.label,
                stroke: "#00A7C1",
                width: 1.5,      // тонкая линия
                alpha: 0.7,      // прозрачность
                fill: "transparent", // чтобы не было закрашивания
              },
            ],
      };

      yData =
        type === "multiLine"
          ? [series.x, ...(series.data || []), ...(series.avgData ? [series.avgData] : [])]
          : [series.x || [], series.data || []];
    } else if (type === "heatmap") {
      containerRef.current.innerHTML =
        "<div style='text-align:center;padding:20px;color:#999;font-family:sans-serif'>Heatmap placeholder</div>";
      return;
    }

    plotRef.current = new uPlot(options, yData, containerRef.current);

    return () => {
      plotRef.current?.destroy();
      plotRef.current = null;
    };
  }, [type, series, width, height]);

  return (
  <div style={{ position: "relative", width, height }}>
    <div ref={containerRef} />

    {/* X axis label */}
    {xLabel && (
      <div
        style={{
          position: "absolute",
          bottom: "-6px",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "12px",
          fontFamily: "sans-serif",
          color: "var(--text)",
        }}
      >
        {xLabel}
      </div>
    )}

    {/* Y axis label */}
    {yLabel && (
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "-40px",
          transform: "rotate(-90deg) translateY(-50%)",
          fontSize: "12px",
          fontFamily: "sans-serif",
          color: "var(--text)",
          textAlign: "center",
        }}
      >
        {yLabel}
      </div>
    )}
  </div>
);
}
