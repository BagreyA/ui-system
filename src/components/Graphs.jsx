import { useEffect, useState, useRef } from "react";
import { Rnd } from "react-rnd";
import { useTranslation } from "react-i18next";
import * as htmlToImage from "html-to-image";
import { saveAs } from "file-saver";
import UPlotGraph from "./graphs/UPlotGraph";
import BoxPlot from "./graphs/BoxPlot";
import HeatMapGrid from "react-heatmap-grid";
import LTEGrid from "./graphs/LTEGrid";
//import useSimulationData from "../hooks/useSimulationData"; 
import SubplotsLine from "./graphs/SubplotsLine"; // --- Маппинг графиков и их меток --- 
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Customized  } from "recharts";

import jsPDF from "jspdf";


// --- Маппинг графиков и их меток ---
const graphLabels = {
  lteGrid: "LTE Resource Grid",
  sinrGraph: "SINR UE",
  cellThroughput: "Cell Throughput",
  userThroughputPerUE: "User Throughput",
  userAvgThroughput: "Average User Throughput",
  fairnessJainOverall: "General Jain Index for Planners",

  cellThroughputAvg: "Cell Throughput (Averaged)",
  userAvgThroughputSmoothed: "User Throughput per UE (Averaged)",
  userMobility: "userMobility",
  trafficOnOff: "trafficOnOff",
};

const scheduler_colors = {
  RR: "#FF5733",
  PF: "#00A7C1",
  BCQI: "#33FF8A",
};

// --- Соответствие ключей CSV ---
const graphKeyMap = {
  lteGrid: "lteGrid",
  sinrGraph: "UE_SINR",
  cellThroughput: "dl_throughput_sum_kbps",
  userThroughputPerUE: "userThroughput",
  userAvgThroughput: "dl_throughput_kbps_avg",
  fairnessJainOverall: "dl_fairness_jain_index_active_window_long",

  cellThroughputAvg: "dl_throughput_sum_kbps",
  userAvgThroughputSmoothed: "dl_throughput_kbps_avg",
};

// --- Тип графиков --- 
const graphTypeMap = {
  lteGrid: "lteGrid",
  sinrGraph: "multiLine",
  cellThroughput: "line",
  userThroughputPerUE: "subplotsLine",
  userAvgThroughput: "bar",
  fairnessJainOverall: "barJain",

  cellThroughputAvg: "line",
  userAvgThroughputSmoothed: "line",
  userMobility: "ueMap",
  trafficOnOff: "trafficOnOff",
};

function movingAverage(data, windowSize = 5) {
  if (!data || data.length === 0) return [];

  return data.map((_, i) => {
    const start = Math.max(0, i - windowSize + 1);
    const subset = data.slice(start, i + 1);
    const avg = subset.reduce((a, b) => a + (b || 0), 0) / subset.length;
    return avg;
  });
}

const uiButton = {
  background: "#00A7C1",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  padding: "6px 12px",
  fontSize: "12px",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const uiButtonHover = {
  background: "#00A7C1",
};

// --- GraphBlock с поддержкой разных типов --- 
function GraphBlock({ name, width, height, series, type, onResize, containerRef }) {
  const { t } = useTranslation("docs");
  console.log("series for", name, series);

  const saveGraphAsImage = () => {
    if (!containerRef.current) return;

    htmlToImage.toPng(containerRef.current).then((dataUrl) => {
      saveAs(dataUrl, `${name}.png`);
    });
  };

  const jainValue = series?.lastValue ?? series?.data?.[0] ?? 0;

  const canvasRef = useRef(null);

  const scaleRef = useRef(1);
  const offsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (type !== "ueMap") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const margin = {
      left: 45,
      right: 10,
      top: 10,
      bottom: 35,
    };

    const gridCount = 10;

    const scaleRef = { current: 1 };
    const offsetRef = { current: { x: 0, y: 0 } };

    const generateSignalPath = (seed) => {
      let x = 50 + seed * 5;
      let y = 50 + seed * 3;

      const path = [];
      let angle = Math.random() * Math.PI * 2;

      for (let i = 0; i < 200; i++) {
        if (i % 10 === 0) {
          angle += (Math.random() - 0.5) * 1.5;
        }

        const signal = Math.sin(i * 0.65 + seed);
        const speed = 2.2 + signal * 1.2;

        x += Math.cos(angle) * speed;
        y += Math.sin(angle) * speed;

        if (x < 0 || x > 100) angle = Math.PI - angle;
        if (y < 0 || y > 100) angle = -angle;

        path.push({ x, y });
      }

      return path;
    };

    const users = Array.from({ length: 5 }, (_, i) => ({
      color: ["#00A7C1", "#FF6B6B", "#ffb938", "#83ff83", "#d146ff"][i],
      path: generateSignalPath(i),
    }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    const draw = () => {
      resize();

      const scale = scaleRef.current;
      const offset = offsetRef.current;

      const plotW = canvas.width - margin.left - margin.right;
      const plotH = canvas.height - margin.top - margin.bottom;

      const centerX = margin.left + plotW / 2;
      const centerY = margin.top + plotH / 2;

      // ================= BACKGROUND =================
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // ================= GRID =================
      ctx.strokeStyle = "rgba(0,0,0,0.18)";
      ctx.lineWidth = 1;

      for (let i = 0; i <= gridCount; i++) {
        const x = margin.left + (plotW / gridCount) * i;
        const y = margin.top + (plotH / gridCount) * i;

        ctx.beginPath();
        ctx.moveTo(x, margin.top);
        ctx.lineTo(x, margin.top + plotH);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(margin.left, y);
        ctx.lineTo(margin.left + plotW, y);
        ctx.stroke();
      }

      // ================= CLIP AREA =================
      ctx.save();
      ctx.beginPath();
      ctx.rect(margin.left, margin.top, plotW, plotH);
      ctx.clip();

      // ================= UE PATHS =================
      users.forEach((u, i) => {
        ctx.strokeStyle = u.color;
        ctx.lineWidth = 2;

        ctx.beginPath();

        u.path.forEach((p, idx) => {
          const x =
            centerX +
            ((p.x / 100) * plotW - plotW / 2) * scale +
            offset.x;

          const y =
            centerY +
            ((p.y / 100) * plotH - plotH / 2) * scale +
            offset.y;

          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });

        ctx.stroke();

        const last = u.path[u.path.length - 1];

        const lx =
          centerX +
          ((last.x / 100) * plotW - plotW / 2) * scale +
          offset.x;

        const ly =
          centerY +
          ((last.y / 100) * plotH - plotH / 2) * scale +
          offset.y;

        ctx.beginPath();
        ctx.arc(lx, ly, 5, 0, Math.PI * 2);
        ctx.fillStyle = u.color;
        ctx.fill();

        ctx.fillStyle = "#000";
        ctx.font = "10px sans-serif";
        ctx.fillText(`UE${i + 1}`, lx + 8, ly + 4);
      });

      ctx.restore();

      // ================= AXIS TITLES (RUS) =================
      ctx.fillStyle = "#000";
      ctx.font = "12px sans-serif";

      // X axis
      ctx.fillText(
        "Ось X",
        margin.left + plotW / 2 - 40,
        canvas.height - 5
      );

      // Y axis
      ctx.save();
      ctx.translate(12, margin.top + plotH / 2 + 30);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText("Ось Y", 0, 0);
      ctx.restore();
    };

    draw();

    const handleWheel = (e) => {
      e.preventDefault();

      const delta = e.deltaY > 0 ? 0.9 : 1.1;

      scaleRef.current = Math.min(
        5,
        Math.max(0.5, scaleRef.current * delta)
      );

      draw();
    };

    canvas.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("resize", draw);

    return () => {
      canvas.removeEventListener("wheel", handleWheel);
      window.removeEventListener("resize", draw);
    };
  }, [type, width, height]);


  return (
  <Rnd
    default={{ x: 20, y: 20, width, height }}
    bounds="parent"
    cancel=".no-drag"
    onResizeStop={(e, dir, ref) =>
      onResize({
        width: ref.offsetWidth,
        height: ref.offsetHeight,
      })
    }
    style={{
      border: "none",
      borderRadius: "8px",
      position: "absolute",
      overflow: "visible",
    }}
  >
    {/* ВАЖНО: ref теперь на весь блок */}
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#fff",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 12px",
          borderBottom: "1px solid var(--border)",
          minHeight: "40px",
          boxSizing: "border-box",
          background: "#fff",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: "12px",
            color: "var(--text)",
            fontFamily: "sans-serif",
            fontWeight: 600,
          }}
        >
          {t(`graphs.${name}`, name)}
        </span>

        <span
          onClick={saveGraphAsImage}
          style={{
            cursor: "pointer",
            fontSize: "16px",
            userSelect: "none",
          }}
          title={t("graphs.saveAsImage", "Сохранить")}
        >
          ⭳
        </span>
      </div>

      {/* Контейнер графика */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          width: "100%",
          position: "relative",
          padding: "8px 8px 24px 8px",
          boxSizing: "border-box",
          overflow: "visible",
        }}
      >
        {type === "subplotsLine" ? (
          <SubplotsLine series={series} width={width - 16} height={height - 70} />
        ) : type === "lteGrid" ? (
          <div style={{ overflow: "auto", width: "100%", height: "100%" }}>
            <LTEGrid
              ttiSlots={series.x || []}
              grid={series.data || []} // series.data = матрица RB x TTI 
              cellSize={20}
            />
          </div>
        ) : type === "line" ? (
          <UPlotGraph
            width={width}
            height={height}
            series={{
              label: series.label,
              x: series.x,
              data: series.data,
              error: series.error,
            }}
            type="line"
            xLabel="Время (мс)"
            yLabel="Пропускная способность"
          />
        ) : type === "bar" ? (
          <UPlotGraph
            width={width}
            height={height}
            series={{
              label: series.label,
              x: series.x,
              data: series.data,
              error: series.error,
            }}
            type="bar"
            xLabel="Время (мс)"
            yLabel="Пропускная способность"
          />
        ) : type === "barJain" ? (
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              padding: "10px 20px 50px 100px",
              boxSizing: "border-box",
              fontFamily: "sans-serif",
            }}
          >
            {/* Y-ось */}
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 50, width: 50, fontSize: 12 }}>
              {/* Деления Y-оси */}
              <div
                style={{
                  position: "absolute",
                  top: 10,
                  bottom: 0,
                  right: 0,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  color: "#888",
                }}
              >
                {[0, 0.25, 0.5, 0.75, 1].reverse().map((val) => (
                  <div key={val}>{val.toFixed(2)}</div>
                ))}
              </div>

              {/* Заголовок Y-оси по вертикали */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: -50, // немного левее оси
                  transform: "translateY(-50%) rotate(-90deg)", // поворот текста
                  textAlign: "center",
                  fontSize: 12,
                  whiteSpace: "nowrap",
                }}
              >
                Индекс Джейна (PF)
              </div>
            </div>

            {/* Горизонтальные линии */}
            <div
              style={{
                position: "absolute",
                left: 50,
                right: 10,
                top: 10,
                bottom: 50,
              }}
            >
              {[0, 0.25, 0.5, 0.75, 1].map((val, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    bottom: `${val * 100}%`,
                    left: 0,
                    right: 0,
                    borderTop: "1px solid #ccc",
                  }}
                />
              ))}
            </div>

            {/* X-ось линия */}
            <div
              style={{
                position: "absolute",
                left: 50,
                right: 10,
                bottom: 50,
                top: 10,
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-end",
              }}
            >
              {/* Сам столбец */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  height: "100%",
                  width: 50,
                }}
              >
                {/* Значение над столбцом */}
                <div style={{ marginBottom: 4, fontSize: 12 }}>
                  {jainValue?.toFixed ? jainValue.toFixed(3) : jainValue}
                </div>

                {/* Прямоугольник */}
                <div
                  style={{
                    width: "100%",
                    height: `${(jainValue || 0) * 100}%`,
                    background: "#33C1FF",
                    borderRadius: 4,
                  }}
                />
              </div>
            </div>
          </div>
        ) : type === "ueMap" ? (
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            style={{ width: "100%", height: "100%" }}
          />
        ) : type === "heatmap" ? (
          Array.isArray(series.data) && series.data.length > 0 ? (
            <HeatMapGrid
              data={series.data}
              xLabels={series.x || series.data[0].map((_, i) => `RB${i + 1}`)}
              yLabels={series.y || series.data.map((_, i) => `TTI${i}`)}
              cellStyle={(x, y, value) => ({
                background: `rgba(0, 167, 193, ${value / 100})`,
                fontSize: "10px",
              })}
              cellRender={(x, y, value) => <div> {Math.round(value)}</div>}
            />
          ) : (
            <div style={{ textAlign: "center", padding: "20px" }}>Нет данных для графика</div>
          )
          ) : type === "trafficOnOff" ? (
            <canvas
              width={width}
              height={height}
              style={{ width: "100%", height: "100%" }}
              ref={(el) => {
                if (!el) return;

                const ctx = el.getContext("2d");
                const w = el.width;
                const h = el.height;

                ctx.clearRect(0, 0, w, h);

                // ================= BACKGROUND =================
                ctx.fillStyle = "#fff";
                ctx.fillRect(0, 0, w, h);

                const margin = { left: 60, right: 10, top: 10, bottom: 40 };

                const plotW = w - margin.left - margin.right;
                const plotH = h - margin.top - margin.bottom;

                const x0 = margin.left;
                const yTop = margin.top;
                const yBottom = margin.top + plotH;

                // ================= SCALES =================
                const MAX_TIME = 60000;
                const MAX_VALUE = 1400;
                const DRAW_MAX = 1300;

                const xScale = (t) => x0 + (t / MAX_TIME) * plotW;
                const yScale = (v) => yBottom - (v / MAX_VALUE) * plotH;

                // ================= GRID =================
                ctx.strokeStyle = "rgba(0,0,0,0.15)";
                ctx.lineWidth = 1;

                for (let t = 0; t <= MAX_TIME; t += 10000) {
                  const x = xScale(t);

                  ctx.beginPath();
                  ctx.moveTo(x, yTop);
                  ctx.lineTo(x, yBottom);
                  ctx.stroke();

                  ctx.fillStyle = "#878787";
                  ctx.font = "10px sans-serif";
                  ctx.fillText(String(t), x - 15, yBottom + 15);
                }

                for (let v = 0; v <= DRAW_MAX; v += 200) {
                  const y = yScale(v);

                  ctx.beginPath();
                  ctx.moveTo(x0, y);
                  ctx.lineTo(x0 + plotW, y);
                  ctx.stroke();

                  ctx.fillStyle = "#878787";
                  ctx.font = "10px sans-serif";
                  const yLabelPadding = 26;
                  ctx.fillText(String(v), x0 - yLabelPadding, y + 3);
                }

                // ================= RED BASELINE =================
                const baseY = yScale(0);

                ctx.strokeStyle = "red";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(x0, baseY);
                ctx.lineTo(x0 + plotW, baseY);
                ctx.stroke();

                // ================= CLUSTERS =================
                const clusters = [
                  { start: 1990, end: 7000, size: 300, color: "#00A7C1" },
                  { start: 22000, end: 23000, size: 100, color: "#00A7C1" },
                  { start: 11000, end: 18000, size: 300, color: "#00A7C1" },
                  { start: 8000, end: 8600, size: 30, color: "#00A7C1" },
                  { start: 30000, end: 30100, size: 20, color: "#00A7C1" },
                  { start: 32000, end: 38600, size: 400, color: "#00A7C1" },
                  { start: 41200, end: 42400, size: 100, color: "#00A7C1" },
                  { start: 50000, end: 50100, size: 20, color: "#00A7C1" },
                  { start: 55000, end: 55500, size: 20, color: "#00A7C1" },
                ];

                clusters.forEach((c) => {
                  const xStart = xScale(c.start);
                  const xEnd = xScale(c.end);
                  const width = Math.max(2, xEnd - xStart);

                  for (let i = 0; i < c.size; i++) {
                    const x = xStart + Math.random() * width;

                    const value = Math.random() * MAX_VALUE;
                    const yTop = yScale(value);

                    ctx.strokeStyle = c.color;
                    ctx.lineWidth = 2;

                    ctx.beginPath();
                    ctx.moveTo(x, baseY);
                    ctx.lineTo(x, yTop);
                    ctx.stroke();
                  }
                });

                const axisFont = "12px sans-serif";
                const axisColor = "var(--subtext)";
                // ================= AXIS LABELS =================
                ctx.fillStyle = axisColor;
                ctx.font = axisFont;

                ctx.fillText("Время (мс)", x0 + plotW / 2, h - 10);

                ctx.save();
                ctx.fillStyle = axisColor;
                ctx.font = axisFont;

                ctx.translate(15, margin.top + plotH / 2);
                ctx.rotate(-Math.PI / 2);
                ctx.fillText("Размер пакета", 0, 0);
                ctx.restore();
              }}
            />
        ) : type === "box" ? (
          Array.isArray(series.data) && series.data.length > 0 ? (
            <BoxPlot
              data={series.data.map((arr, idx) => ({
                name: `UE${idx + 1}`,
                min: arr?.[0] ?? 0,
                q1: arr?.[1] ?? 0,
                median: arr?.[2] ?? 0,
                q3: arr?.[3] ?? 0,
                max: arr?.[4] ?? 0,
              }))}
              width={width - 20}
              height={height - 30}
            />
          ) : (
            <div style={{ textAlign: "center", padding: "20px" }}>Нет данных для графика</div>
          )
        ) : null}
        </div>
      </div>
    </Rnd>
  );
}

function jainIndex(values) {
  if (!values || values.length === 0) return 0;

  const sum = values.reduce((a, b) => a + b, 0);
  const sumSq = values.reduce((a, b) => a + b * b, 0);

  if (sumSq === 0) return 0;

  return (sum * sum) / (values.length * sumSq);
}

function computeJainTimeSeries(graphData) {
  const avg = graphData["dl_throughput_kbps_avg"]?.data || [];
  const std = graphData["dl_throughput_kbps_std"]?.data || [];
  const active = graphData["sch_active_ue_count"]?.data || [];

  if (!avg.length) return [];

  return avg.map((mean, i) => {
    const ueCount = active[i] || 1;
    const sigma = std[i] || 0;
    // коэффициент вариации 
    const cv = mean === 0 ? 0 : sigma / mean;
    // аппроксимация fairness 
    const fairness = 1 / (1 + cv * cv);

    return fairness;
  });
}

function computeOverallJain(graphData) {
  const series = graphData["dl_fairness_jain_index"]?.data || [];
  if (!series.length) return 0;
  return series.reduce((a, b) => a + b, 0) / series.length;
}

// --- Главный компонент Graphs --- 
export default function Graphs({ selectedGraphs }) {
    const [time, setTime] = useState(0);
    const [sizes, setSizes] = useState({});
    //const lteData = useSimulationData(); 
    const [graphData, setGraphDataState] = useState({});
    const [gridData, setGridData] = useState({ ttiSlots: [], grid: [] });
    const graphRefs = useRef({});
    const [exportMode, setExportMode] = useState("png");

    const exportAllToPDF = async () => {
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const margin = 10;

    const maxWidth = pageWidth - margin * 2;
    const maxHeight = pageHeight - margin * 2;

    const entries = Object.entries(graphRefs.current);

    for (let i = 0; i < entries.length; i++) {
      const [name, node] = entries[i];

      if (!node) continue;

      const imgData = await htmlToImage.toPng(node, {
        pixelRatio: 2, // лучшее качество
        backgroundColor: "#ffffff",
      });

      const imgProps = pdf.getImageProperties(imgData);

      let imgWidth = maxWidth;
      let imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      // если не помещается по высоте
      if (imgHeight > maxHeight) {
        imgHeight = maxHeight;
        imgWidth = (imgProps.width * imgHeight) / imgProps.height;
      }

      // центрирование
      const x = (pageWidth - imgWidth) / 2;
      const y = (pageHeight - imgHeight) / 2;

      if (i !== 0) {
        pdf.addPage();
      }

      pdf.addImage(
        imgData,
        "PNG",
        x,
        y,
        imgWidth,
        imgHeight
      );
    }

    pdf.save("graphs.pdf");
  };

  useEffect(() => {
    const load = async () => {
      const [statsRes, detailedRes] = await Promise.all([
        fetch("/data/sim_stats.json"),
        fetch("/data/sim_stats_detailed.json"),
      ]);

      const stats = await statsRes.json();
      const detailed = await detailedRes.json();

      const graphResult = {};
      const x = stats.map((row) => row.tti);

      Object.keys(stats[0])
        .filter((k) => k !== "tti")
        .forEach((key) => {
          graphResult[key] = {
            label: key,
            x,
            data: stats.map((row) => row[key] ?? null),
          };
        });

      setGraphDataState(graphResult);

      const ttiKeys =
        Object.keys(detailed).map(Number).sort((a, b) => a - b);

      const maxRB = Math.max(
        ...ttiKeys.map((tti) =>
          Object.values(detailed[tti]).reduce(
            (sum, ue) => sum + (ue.rb_allocated || 0),
            0
          )
        )
      );

      const grid = Array.from({ length: maxRB }, () =>
        Array(ttiKeys.length).fill(null)
      );

      ttiKeys.forEach((tti, colIdx) => {
        const ueList = Object.entries(detailed[tti]);
        let rbIndex = 0;

        ueList.forEach(([ueId, ue]) => {
          const rbCount = ue.rb_allocated || 0;

          for (let i = 0; i < rbCount; i++) {
            if (rbIndex < maxRB) {
              grid[rbIndex][colIdx] = parseInt(ueId);
              rbIndex++;
            }
          }
        });
      });

      setGridData({ ttiSlots: ttiKeys, grid });
    };

    load();
  },
    []);

  const getSeriesData = (name) => {
    if (name === "lteGrid") {
      return { label: graphLabels[name], data: gridData.grid, x: gridData.ttiSlots, yLabels: gridData.ttiSlots };
    }

    if (name === "userMobility") {
      return {
        label: "User Mobility",
        data: [], // не нужно для canvas
      };
    }

    if (name === "sinrGraph") {
      const x = graphData["dl_sinr_avg"]?.x || graphData["tti"]?.data || [];
      const avgData = graphData["dl_sinr_avg"]?.data || [];
      return {
        label: "Средний SINR",
        data: [], // линии UE нет 
        x,
        avgData, // красная линия среднего SINR 
        avgLabel: "Средний SINR",
      };
    }

    if (name === "userThroughputPerUE") {
      const tti = graphData["tti"]?.data || [];
      const avg = graphData["dl_throughput_kbps_avg"]?.data || [];
      const activeUE = graphData["sch_active_ue_count"]?.data || [];

      // Берём только 2 UE, делим среднюю пропускную на активных UE 
      const ueData = [0, 1].map(() =>
        avg.map((val, idx) => val / Math.max(activeUE[idx] || 1, 1))
      );

      if (!graphData) return { label: name, data: [] };
      if (name === "userAvgThroughput") {
        const avgThroughput = graphData["dl_throughput_kbps_avg"]?.data || [];
        const stdThroughput = graphData["dl_throughput_kbps_std"]?.data || [];
        const userIds = avgThroughput.map((_, i) => `UE${i + 1}`);
        return {
          label: graphLabels[name],
          x: userIds,
          data: avgThroughput,
          yLabels: avgThroughput,
          error: stdThroughput, // error bar 
        };
      }

      return {
        label: "Пропускная способность UE",
        x: tti,
        data: ueData,
        userIds: [1, 2],
      };
    }

    if (name === "fairnessJainOverall") {
      const raw =
        graphData["dl_fairness_jain_index_active_window_long"]?.data;

      const value = typeof raw === "number"
        ? raw
        : Array.isArray(raw)
          ? raw[raw.length - 1]
          : 0;

      return {
        label: "Jain Index",
        x: ["Jain"],
        data: [value],
        lastValue: value,
      };
    }

    if (name === "cellThroughputAvg") {
      const raw = graphData["dl_throughput_sum_kbps"]?.data || [];
      const x = graphData["dl_throughput_sum_kbps"]?.x || [];

      return {
        label: "Cell Throughput (Avg)",
        x,
        data: movingAverage(raw, 10),
      };
    }

    if (name === "userAvgThroughputSmoothed") {
      const avg = graphData["dl_throughput_kbps_avg"]?.data || [];
      const x = graphData["dl_throughput_kbps_avg"]?.x || [];

      const smoothed = movingAverage(avg, 10);

      const minLen = Math.min(smoothed.length, x.length);

      return {
        label: graphLabels[name],
        x: x.slice(0, minLen),
        data: smoothed.slice(0, minLen),
      };
    }

    if (name === "trafficOnOff") {
      const x = graphData["dl_throughput_sum_kbps"]?.x || [];
      const y = graphData["dl_throughput_sum_kbps"]?.data || [];

      return {
        label: "ON/OFF Traffic",
        x,
        data: y,
      };
    }



    const key = graphKeyMap[name];
    if (!graphData || !graphData[key]) return { label: name, data: [] };
    let x = graphData[key].tti || graphData[key].x || [];
    let y = graphData[key].data || [];

    switch (name) {
      case "lteGrid":
        y = gridData.grid;
        x = gridData.ttiSlots;
        return {
          label: graphLabels[name],
          data: y,
          x,
          yLabels: gridData.ttiSlots,
        };




      case "averageUserThroughput":
        // Делим на активных UE 
        const active = graphData["sch_active_ue_count"]?.data || [];
        y = graphData[key].data.map((val, idx) => val / Math.max(active[idx] || 1, 1));
        break;

      case "spectralEfficiency":
        // Берём реальные данные для спектральной эффективности 
        y = graphData["dl_spectral_efficiency_avg_ue"]?.data || [];
        x = graphData["dl_spectral_efficiency_avg_ue"]?.x || x;
        break;

      case "cellThroughput":
        y = graphData["dl_throughput_sum_kbps"]?.data || [];
        x = graphData["dl_throughput_sum_kbps"]?.x || [];
        break;

      // остальные случаи оставляем как есть 
      case "bufferUsage":
        const bufferSeries = graphData["buffer_size_sum_bytes"];
        y = bufferSeries?.data || [];
        x = y.map((_, i) => `UE${i + 1}`);
        break;// Берём то, что реально есть break; 


      case "rbUtilization":
        y = graphData[key]?.data || [];
        x = graphData[key]?.x || [];
        break;

      case "throughputBoxplot":
        y = graphData[key]?.data || [];
        break;
    }

    return { label: graphLabels[name] || name, data: y, x, yLabels: x };
  };

  return (
    <div style={{ position: "relative", width: "100%", minHeight: "700px" }}>
    <div
      style={{
        position: "fixed",
        top: 10,
        right: 90,
        display: "flex",
        gap: "10px",
        zIndex: 9999,
        background: "var(--bg)",
        padding: "6px",
        borderRadius: "6px",
        fontFamily: "sans-serif",
      }}
    >
      <select
        value={exportMode}
        onChange={(e) => setExportMode(e.target.value)}
          style={{
            border: "1px solid var(--border)",
            borderRadius: "6px",
            padding: "6px 10px",
            fontSize: "12px",
            background: "var(--bg)",
            color: "var(--subtext)",
            cursor: "pointer",
          }}
      >
        <option value="png">По одному PNG</option>
        <option value="pdf">Все в PDF</option>
      </select>

      <button
        style={uiButton}
        onMouseEnter={(e) => (e.target.style.background = "var(--card)")}
        onMouseLeave={(e) => (e.target.style.background = "var(--subtext)")}
        onClick={() => {
          if (exportMode === "pdf") {
            exportAllToPDF();
          }
        }}
      >
        Скачать PDF
      </button>
    </div>
      {selectedGraphs.map((name, idx) => {
        const width = sizes[idx]?.width || 300;
        const height = sizes[idx]?.height || 180;

        const series = getSeriesData(name);
        const type = graphTypeMap[name] || "line";

        return (
          <GraphBlock
            key={idx}
            name={name}
            width={width}
            height={height}
            series={series}
            type={type}
            containerRef={(el) => {
              graphRefs.current[name] = el;
            }}
            onResize={(size) => setSizes((prev) => ({ ...prev, [idx]: size }))}
          />
        );
      })}

      {/* Общий ползунок времени */}
      {/* 
          {selectedGraphs.length > 0 && ( 
          <div 
            style={{ 
              position: "fixed", 
              bottom: "30px", 
              left: "50%", 
              transform: "translateX(-50%)", 
              width: "70%", 
              display: "flex", 
              alignItems: "center", 
              gap: "10px", 
              fontFamily: "sans-serif", 
              padding: "5px 10px", 
              borderRadius: "8px", 
              }} 
            > 
            <label>Время: {time}</label> 
            <input 
            type="range" 
            min="0" 
            max="100" 
            value={time} 
            onChange={(e) => setTime(parseInt(e.target.value))} 
            style={{ flex: 1 }}
             /> 
             <span>{time}</span> 
             </div> )} 
             */}
    </div>
  );
}