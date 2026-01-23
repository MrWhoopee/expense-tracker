"use client";

import { PieChart, Pie, ResponsiveContainer } from "recharts";
import css from "./TransactionsChart.module.css";

interface DataItem {
  name: string;
  value: number;
  fill: string;
}

interface LayerItem extends DataItem {
  displayValue: number;
}

export default function TransactionsChart() {
  const data: DataItem[] = [
    { name: "Hobby", value: 45, fill: "#0ef387" },
    { name: "Products", value: 25, fill: "#0ebb69" },
    { name: "Cinema", value: 20, fill: "#fafafa" },
    { name: "Health", value: 10, fill: "rgba(250, 250, 250, 0.2) " },
  ];

  const layers: LayerItem[] = [];
  let cumulative = 100;

  for (let i = data.length - 1; i >= 0; i--) {
    layers.push({
      ...data[i],
      displayValue: cumulative,
    });
    cumulative -= data[i].value;
  }

  return (
    <div className={css.container}>
      <h3 className={css.title}>Expenses categories</h3>
      <div className={css.contentWrapper}>
        <div className={css.chartContainer}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
              {layers.map((layer, index) => (
                <Pie
                  key={layer.name}
                  data={[
                    { value: layer.displayValue, fill: layer.fill },
                    { value: 100 - layer.displayValue, fill: "transparent" },
                  ]}
                  dataKey="value"
                  cx="50%"
                  cy={143}
                  startAngle={180}
                  endAngle={0}
                  innerRadius={93}
                  outerRadius={143}
                  cornerRadius={10}
                  stroke="none"
                  isAnimationActive={true}
                  animationBegin={200}
                  animationDuration={1200}
                  animationEasing="ease-out"
                />
              ))}
            </PieChart>
          </ResponsiveContainer>
          <p className={css.totalLabel}>100%</p>
        </div>

        <ul
          className={`${css.categoryList} ${data.length > 4 ? css.scrollable : ""}`}
        >
          {data.map((item, index) => (
            <li key={index} className={css.categoryItem}>
              <div className={css.categoryInfo}>
                <span
                  className={css.marker}
                  style={{ backgroundColor: item.fill }}
                />
                <p className={css.categoryName}>{item.name}</p>
              </div>
              <p className={css.categoryPercentage}>{item.value}%</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
