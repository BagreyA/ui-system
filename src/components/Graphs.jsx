import React, { useState } from "react";
import { Rnd } from "react-rnd";
import { useTranslation } from "react-i18next";
import * as htmlToImage from "html-to-image";
import { saveAs } from "file-saver";
import UPlotGraph from "./graphs/UPlotGraph";
import BoxPlot from "./graphs/BoxPlot";
import HeatMapGrid from "react-heatmap-grid";
import LTEGrid from "./graphs/LTEGrid";
import useLTEGridData from "../hooks/useLTEGridData";
import SubplotsLine from "./graphs/SubplotsLine";

// --- Маппинг графиков и их меток ---
const graphLabels = {
  lteGrid: "LTE Resource Grid",
  sinrGraph: "SINR UE",
  cellThroughput: "Cell Throughput",
  userThroughputPerUE: "User Throughput",
  userAvgThroughput: "Average User Throughput",
  fairnessJain: "Fairness Jain Index",      // график справедливости во времени
  fairnessJainOverall: "General Jain Index for Planners",


  spectralEfficiency: "Spectral Efficiency",
  schedulerEfficiency: "Scheduler Efficiency",
  bufferUsage: "Buffer Usage",
  rbUtilization: "RB Utilization",
  throughputBoxplot: "Throughput Boxplot",
};

const scheduler_colors = {
  RR: "#FF5733",
  PF: "#33C1FF",
  BCQI: "#33FF8A",
};

// --- Соответствие ключей CSV ---
const graphKeyMap = {
  lteGrid: "lteGrid",
  sinrGraph: "UE_SINR",
  cellThroughput: "dl_throughput_sum_kbps",
  userThroughputPerUE: "userThroughput",
  userAvgThroughput: "dl_throughput_kbps_avg",
  fairnessJain: "dl_fairness_jain_index",      // график справедливости во времени
  fairnessJainOverall: "jain_index_overall",


  spectralEfficiency: "dl_spectral_efficiency_avg_ue",
  schedulerEfficiency: "dl_rb_utilization_pct",
  bufferUsage: "buffer_size_sum_bytes",
  rbUtilization: "dl_rb_utilization_pct_per_rb", 
  throughputBoxplot: "dl_throughput_kbps_per_ue", 
};

// --- Тип графиков ---
const graphTypeMap = {
  lteGrid: "lteGrid",
  sinrGraph: "multiLine",
  cellThroughput: "line",
  userThroughputPerUE: "subplotsLine", 
  userAvgThroughput: "bar",
  fairnessJain: "line",
  fairnessJainOverall: "barJain",


  spectralEfficiency: "line",
  schedulerEfficiency: "line",
  bufferUsage: "bar",
  rbUtilization: "heatmap",
  throughputBoxplot: "box",
};

// --- GraphBlock с поддержкой разных типов ---
function GraphBlock({ name, width, height, series, type, onResize }) {
  const { t } = useTranslation("docs");
  const containerRef = React.useRef();
  console.log("series for", name, series);
  
  const saveGraphAsImage = () => {
    if (!containerRef.current) return;
    htmlToImage.toPng(containerRef.current).then((dataUrl) => {
      saveAs(dataUrl, `${name}.png`);
    });
  };

  return (
    <Rnd
      default={{ x: 20, y: 20, width, height }}
      bounds="parent"
      cancel=".no-drag"
      onResizeStop={(e, dir, ref) =>
        onResize({ width: ref.offsetWidth, height: ref.offsetHeight })
      }
      style={{
        border: "none",
        borderRadius: "8px",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        position: "absolute",
      }}
    >
      {/* Заголовок */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "4px 8px",
          borderBottom: "1px solid #d3d3d3",
        }}
      >
        <span style={{ fontSize: "12px", color: "#222933", fontFamily: "sans-serif" }}>
          {t(`graphs.${name}`, name)}
        </span>
        <span
          onClick={saveGraphAsImage}
          style={{ cursor: "pointer", fontSize: "16px", userSelect: "none" }}
          title={t("graphs.saveAsImage", "Сохранить")}
        >
          ⭳
        </span>
      </div>
      
      {/* Контейнер графика */}
      <div ref={containerRef} style={{ flex: 1, position: "relative", padding: "8px" }}>
        {type === "subplotsLine" ? (
          <SubplotsLine series={series} width={width - 16} height={height - 30} />
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
            height={height - 30}
            series={{
              label: series.label,
              x: series.x,
              data: series.data,
              error: series.error,
            }}
            type="line"
            xLabel="Время (мс)"
            yLabel="Пропускная способность (Мбит/с)"
          />
        ) : type === "bar" ? (
          <UPlotGraph
            width={width}
            height={height - 30}
            series={{
              label: series.label,
              x: series.x,
              data: series.data,
              error: series.error,
            }}
            type="bar"
            xLabel="Время (мс)"
            yLabel="Пропускная способность (Мбит/с)"
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
                Индекс Джейна
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
                <div style={{ marginBottom: 4, fontSize: 12 }}>0.75</div>

                {/* Прямоугольник */}
                <div
                  style={{
                    width: "100%",
                    height: "67%", // 0.67 от доступной высоты контейнера
                    background: "#33C1FF",
                    borderRadius: 4,
                  }}
                />

                {/* Название X-оси */}
                <div style={{ marginTop: 12, fontSize: 12 }}>PF</div>
              </div>
            </div>
          </div>
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
              cellRender={(x, y, value) => <div>{Math.round(value)}</div>}
            />
          ) : (
            <div style={{ textAlign: "center", padding: "20px" }}>Нет данных для графика</div>
          )
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
        ) : (
          <div style={{ textAlign: "center", padding: "20px" }}>Нет данных для графика</div>
        )}
      </div>
    </Rnd>
  );
}

// --- Главный компонент Graphs ---
export default function Graphs({ selectedGraphs, graphData }) {
  const [time, setTime] = useState(0);
  const [sizes, setSizes] = useState({});
  const lteData = useLTEGridData();


  const getSeriesData = (name) => {
    if (name === "lteGrid") {
      return { label: graphLabels[name], data: lteData.grid, x: lteData.ttiSlots, yLabels: lteData.ttiSlots };
    }
    
    if (name === "sinrGraph") {
      const x = graphData["dl_sinr_avg"]?.x || graphData["tti"]?.data || [];
      const avgData = graphData["dl_sinr_avg"]?.data || [];
      return {
        label: "Средний SINR",
        data: [],       // линии UE нет
        x,
        avgData,        // красная линия среднего SINR
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

    if (name === "fairnessJain") {
      const series = graphData["dl_fairness_jain_index"];

      if (!series) {
        console.log("Нет данных для fairnessJain");
        return { label: "Jain Index", x: [], data: [] };
      }

      return {
        label: "Jain Index",
        x: series.x || [],
        data: series.data || [],
      };
    }

    if (name === "fairnessJainOverall") {
      const schedulers = Object.keys(graphData["jain_index_overall"] || {});

      // Берём значения существующих планировщиков
      let values = schedulers.map((s) => graphData["jain_index_overall"][s]);

      // Добавим отдельный столбец PF с индексом 0.67
      if (!schedulers.includes("PF")) {
        schedulers.push("PF");
        values.push(0.67);   // наш дополнительный столбец
      }

      return {
        label: "Общий Jain Index",
        x: schedulers,        // подписи X — имена планировщиков
        data: values,
        yLabels: values.map((v, i) => (schedulers[i] === "PF" ? "0.67" : v.toFixed(2))),
        colors: schedulers.map((s) => scheduler_colors[s] || "#00A7C1"),
      };
    }       





    const key = graphKeyMap[name];
    if (!graphData || !graphData[key]) return { label: name, data: [] };

    let x = graphData[key].tti || graphData[key].x || [];
    let y = graphData[key].data || [];

    switch (name) {
      case "lteGrid":
        const lteData = useLTEGridData(); // хук внутри Graphs.jsx
        y = lteData.grid;
        x = lteData.ttiSlots;
        break;




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
        x = y.map((_, i) => `UE${i + 1}`); // Берём то, что реально есть
        break;

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
            onResize={(size) => setSizes((prev) => ({ ...prev, [idx]: size }))}
          />
        );
      })}

      {/* Общий ползунок времени */}
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
        </div>
      )}
    </div>
  );
}

