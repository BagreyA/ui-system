import React, { useState, useEffect, useRef } from "react";
import { Rnd } from "react-rnd";
import { useTranslation } from "react-i18next";
import * as htmlToImage from "html-to-image";
import { saveAs } from "file-saver";

const graphLabels = {
  cellThroughput: "Cell Throughput",
  userThroughput: "User Throughput",
  averageUserThroughput: "Average User Throughput",
  fairnessJain: "Fairness Jain Index",
  spectralEfficiency: "Spectral Efficiency",
  schedulerEfficiency: "Scheduler Efficiency",
};

async function fetchGraphData(graphName, time, prevHistory = [], userCount = 4) {
  if (graphName === "userThroughput") {
    return Array.from({ length: userCount }, (_, i) => {
      const lastPoint = prevHistory[i]?.[prevHistory[i].length - 1] || { x: 50, y: 50 };
      return {
        x: Math.max(0, Math.min(100, lastPoint.x + (Math.random() - 0.5) * 10)),
        y: Math.max(0, Math.min(100, lastPoint.y + (Math.random() - 0.5) * 10)),
      };
    });
  }
  return Array.from({ length: 10 }, (_, i) => ({ x: i * 10, y: Math.random() * 100 }));
}

function GraphBlock({ name, width, height, data, onResize }) {
  const { t } = useTranslation("docs");
  const graphRef = useRef();

  const saveGraphAsImage = () => {
    if (!graphRef.current) return;
    htmlToImage.toPng(graphRef.current).then((dataUrl) => {
      saveAs(dataUrl, `${name}.png`);
    });
  };

  const paddingTop = 20;
  const paddingBottom = 30;
  const paddingLeft = 40;
  const paddingRight = 10;
  const graphWidth = width - paddingLeft - paddingRight;
  const graphHeight = height - paddingTop - paddingBottom;
  const lineScale = Math.max(1, graphWidth / 250);
  const colors = ["#00A7C1", "#FF7F50", "#32CD32", "#FFD700", "#8A2BE2", "#FF1493", "#00CED1", "#FF4500"];

  return (
    <Rnd
      default={{ x: 20, y: 20, width, height }}
      bounds="parent"
      cancel=".no-drag"
      onResizeStop={(e, dir, ref) => onResize({ width: ref.offsetWidth, height: ref.offsetHeight })}
      style={{
        border: "none",
        borderRadius: "8px",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        position: "absolute",
      }}
    >
      {/* Заголовок и иконка сохранения */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 8px", borderBottom: "1px solid #d3d3d3" }}>
        <span style={{ fontSize: "12px", color:"#222933", fontFamily: "sans-serif" }}>
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

      {/* SVG графика */}
      <div ref={graphRef} style={{ flex: 1, position: "relative" }}>
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          {/* Сетка */}
          {[...Array(5)].map((_, i) => (
            <line
              key={`gridY${i}`}
              x1={paddingLeft}
              y1={paddingTop + (graphHeight / 4) * i}
              x2={paddingLeft + graphWidth}
              y2={paddingTop + (graphHeight / 4) * i}
              stroke="#eee"
              strokeWidth={1}
            />
          ))}
          {[...Array(6)].map((_, i) => (
            <line
              key={`gridX${i}`}
              x1={paddingLeft + (graphWidth / 5) * i}
              y1={paddingTop}
              x2={paddingLeft + (graphWidth / 5) * i}
              y2={paddingTop + graphHeight}
              stroke="#eee"
              strokeWidth={1}
            />
          ))}

          {/* Оси */}
          <line
            x1={paddingLeft}
            y1={paddingTop + graphHeight}
            x2={paddingLeft + graphWidth}
            y2={paddingTop + graphHeight}
            stroke="#888"
            strokeWidth={lineScale}
          />
          <line
            x1={paddingLeft}
            y1={paddingTop}
            x2={paddingLeft}
            y2={paddingTop + graphHeight}
            stroke="#888"
            strokeWidth={lineScale}
          />

          {/* Подписи осей */}
          <text
            x={paddingLeft + graphWidth / 2}
            y={paddingTop + graphHeight + 15}
            textAnchor="middle"
            fontSize="10"
            fill="#222933"
            fontFamily="sans-serif"
          >
            {t("graphs.axisX", "x")}
          </text>
          <text
            x={paddingLeft - 15}
            y={paddingTop + graphHeight / 2}
            textAnchor="middle"
            fontSize="10"
            fill="#222933"
            fontFamily="sans-serif"
            transform={`rotate(-90, ${paddingLeft - 15}, ${paddingTop + graphHeight / 2})`}
          >
            {t("graphs.axisY", "y")}
          </text>

          {/* Линии графика */}
          {name === "userThroughput"
            ? data.map((userPoints, uIdx) => (
                <polyline
                  key={uIdx}
                  fill="none"
                  stroke={colors[uIdx % colors.length]}
                  strokeWidth={lineScale}
                  points={userPoints.map(
                      (p) =>
                        `${paddingLeft + (p.x / 100) * graphWidth},${paddingTop + graphHeight - (p.y / 100) * graphHeight}`
                    )
                    .join(" ")}
                />
              ))
            : (
                <polyline
                  fill="none"
                  stroke={colors[0]}
                  strokeWidth={lineScale}
                  points={data.map(
                      (p) =>
                        `${paddingLeft + (p.x / 100) * graphWidth},${paddingTop + graphHeight - (p.y / 100) * graphHeight}`
                    )
                    .join(" ")}
                />
              )}

          {/* Легенда для userThroughput */}
          {name === "userThroughput" &&
            data.map((_, uIdx) => (
              <text
                key={`legend${uIdx}`}
                x={paddingLeft + 5}
                y={paddingTop + 15 + uIdx * 12}
                fontSize="10"
                fill={colors[uIdx % colors.length]}
                fontFamily="sans-serif"
              >
                {t("graphs.user", "Пользователь")} {uIdx + 1}
              </text>
            ))}
        </svg>
      </div>
    </Rnd>
  );
}

export default function Graphs({ selectedGraphs }) {
  const [time, setTime] = useState(0);
  const [userDataHistory, setUserDataHistory] = useState([]);
  const [otherDataHistory, setOtherDataHistory] = useState({});
  const [sizes, setSizes] = useState({});

  useEffect(() => {
    selectedGraphs.forEach(async (name) => {
      if (name === "userThroughput") {
        const newData = await fetchGraphData(name, time, userDataHistory);
        setUserDataHistory((prev) => newData.map((p, i) => [...(prev[i] || []), p]));
      } else {
        const newData = await fetchGraphData(name, time, otherDataHistory[name] || []);
        setOtherDataHistory((prev) => ({ ...prev, [name]: newData }));
      }
    });
  }, [time, selectedGraphs]);

  return (
    <div style={{ position: "relative", width: "100%", minHeight: "700px" }}>
      {/* Графики */}
      {selectedGraphs.map((name, idx) => {
        const width = sizes[idx]?.width || 300;
        const height = sizes[idx]?.height || 180;
        const data = name === "userThroughput" ? userDataHistory : otherDataHistory[name] || [];

        return (
          <GraphBlock
            key={idx}
            name={name}
            width={width}
            height={height}
            data={data}
            onResize={(size) => setSizes((prev) => ({ ...prev, [idx]: size }))}
          />
        );
      })}
      {/* Общий ползунок времени */}
      {selectedGraphs.length > 0 && (
        <div style={{
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
          borderRadius: "8px"
        }}>
          <label>Время: {time}</label>
          <input
            type="range"
            min="0"
            max="100"
            value={time}
            onChange={(e) => setTime(parseInt(e.target.value))}
            style={{ flex: 1 }}
          />
          <span>{time}</span> {/* отсчёт текущего значения */}
        </div>
      )}
    </div>
  );
}
