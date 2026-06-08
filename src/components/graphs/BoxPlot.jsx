import React from "react";
import {
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Bar,
  ErrorBar,
} from "recharts";

/**
 * BoxPlot для Recharts
 * @param {Array} data - массив объектов {name, min, q1, median, q3, max}
 * @param {number} width - ширина
 * @param {number} height - высота
 */
export default function BoxPlot({ data, width, height }) {
  if (!data || data.length === 0) return <div>Нет данных для BoxPlot</div>;

  // Создаём данные для ErrorBar
  const errorData = data.map(d => ({
    value: d.median,
    low: d.q1,
    high: d.q3,
  }));

  return (
    <ComposedChart width={width} height={height} data={data} margin={{ top: 20, bottom: 20 }}>
      <CartesianGrid stroke="#f5f5f5" />
      <XAxis dataKey="name" tickFormatter={(val) => `UE ${val}`}/>
      <YAxis label={{ value: "Пропускная способность (кбит/с)", angle: -90, position: "insideLeft" }}/>
      <Tooltip />
      <Bar dataKey="median" fill="#00A7C1">
        <ErrorBar
          dataKey="median"
          width={4}
          strokeWidth={2}
          stroke="var(--text)"
          direction="y"
          data={errorData}
        />
      </Bar>
    </ComposedChart>
  );
}
