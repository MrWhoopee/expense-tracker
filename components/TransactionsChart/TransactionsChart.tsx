"use client";

import { useMemo } from "react";
import { PieChart, Pie, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { getStatsCurrentMonth } from "@/lib/clientApi";
import css from "./TransactionsChart.module.css";

interface DataItem {
  name: string;
  value: number;
  fill: string;
}

interface LayerItem extends DataItem {
  displayValue: number;
}

const COLORS = [
  "var(--chart-color-1)",
  "var(--chart-color-2)",
  "var(--chart-color-3)",
  "var(--chart-color-4)",
  "var(--chart-color-5)",
  "var(--chart-color-6)",
];

// const DEFAULT_DATA = [
//   { name: "Sex", value: 35 },
//   { name: "Drugs", value: 25 },
//   { name: "Rock'n'roll", value: 15 },
//   { name: "Cinema", value: 7 },
//   { name: "Some alcohol", value: 10 },
//   { name: "Vandalism", value: 7 },
//   { name: "Health", value: 1 },
// ];

export default function TransactionsChart() {
  const { data: stats = [], isLoading } = useQuery({
    queryKey: ["transactions", "stats", "current-month"],
    queryFn: () => getStatsCurrentMonth(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const hasData = stats && stats.length > 0;

  const processedData: DataItem[] = useMemo(() => {
    if (!hasData) return [];

    // const grouped = transactions.reduce((acc: Record<string, number>, curr) => {
    //   const name = curr.category.categoryName;
    //   acc[name] = (acc[name] || 0) + curr.sum;
    //   return acc;
    // }, {});

    const sortedData = [...stats].sort((a, b) => b.totalAmount - a.totalAmount);
    const totalSum = sortedData.reduce(
      (acc, curr) => acc + curr.totalAmount,
      0,
    );

    let finalItems = [];

    if (sortedData.length <= 6) {
      finalItems = sortedData.map((s) => ({
        name: s.category,
        value: s.totalAmount,
      }));
    } else {
      const topFive = sortedData
        .slice(0, 5)
        .map((s) => ({ name: s.category, value: s.totalAmount }));
      const othersValue = sortedData
        .slice(5)
        .reduce((acc, curr) => acc + curr.totalAmount, 0);
      finalItems = [...topFive, { name: "Other", value: othersValue }];
    }

    return finalItems.map((item, index) => ({
      name: item.name,
      value: totalSum > 0 ? Math.round((item.value / totalSum) * 100) : 0,
      fill: item.name === "Other" ? COLORS[5] : COLORS[index % 5],
    }));
  }, [stats, hasData]);

  const layers: LayerItem[] = useMemo(() => {
    if (!hasData) {
      return [
        {
          name: "Empty",
          value: 100,
          displayValue: 100,
          fill: "var(--chart-color-3)",
        },
      ];
    }

    const result: LayerItem[] = [];
    let cumulative = 100;
    for (let i = processedData.length - 1; i >= 0; i--) {
      result.push({
        ...processedData[i],
        displayValue: cumulative,
      });
      cumulative -= processedData[i].value;
    }
    return result;
  }, [processedData, hasData]);

  if (isLoading) {
    return (
      <div className={css.container}>
        <h3 className={css.title}>Expenses categories</h3>
        <div className={css.contentWrapper}>
          <div className={css.chartContainer}>
            <div className={css.skeletonChart}></div>
          </div>
          <div className={css.skeletonList}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className={css.skeletonItem} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={css.container}>
      <h3 className={css.title}>Expenses categories</h3>
      <div className={css.contentWrapper}>
        <div className={css.chartContainer}>
          <ResponsiveContainer width="100%" height="100%" minHeight={1}>
            <PieChart margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
              {layers.map((layer) => (
                <Pie
                  key={layer.name}
                  data={[
                    { value: layer.displayValue, fill: layer.fill },
                    { value: 100 - layer.displayValue, fill: "transparent" },
                  ]}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius="65%"
                  outerRadius="100%"
                  paddingAngle={0}
                  cornerRadius={10}
                  stroke="none"
                  isAnimationActive={true}
                />
              ))}
            </PieChart>
          </ResponsiveContainer>
          <p className={css.totalLabel}>{hasData ? "100%" : "0%"}</p>
        </div>

        {hasData ? (
          <ul
            className={`${css.categoryList} ${processedData.length > 4 ? css.scrollable : ""}`}
          >
            {processedData.map((item, index) => (
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
        ) : (
          <div className={css.noDataWrapper}>
            <p className={css.noDataText}>
              There are no expense transactions yet. <br />
              Please add your first expense to see the statistics.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
