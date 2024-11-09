import React, { useEffect, useRef } from "react";
import * as echarts from "echarts/core";
import { GridComponent } from "echarts/components";
import { BarChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([GridComponent, BarChart, CanvasRenderer]);

const EChartsBarChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const myChart = echarts.init(chartRef.current);
    const option = {
      xAxis: {
        type: "category",
        data: ["Thứ hai", "Tue", "Thứ tư", "Thu", "Thứ sáu", "Sat", "Chủ nhật"],
      },
      yAxis: {
        type: "value",
        splitNumber: 1, // Chỉ có 4 mức (ticks) trên trục y
      },
      series: [
        {
          data: [80, 40, 20, 80, 70, 100, 20],
          type: "bar",
          showBackground: true,
          backgroundStyle: {
            color: "rgba(180, 180, 180, 0.2)",
          },
        },
      ],
    };
    myChart.setOption(option);

    return () => {
      myChart.dispose();
    };
  }, []);

  return <div ref={chartRef} style={{ width: "100%", height: "80px" }} />;
};

export default EChartsBarChart;
