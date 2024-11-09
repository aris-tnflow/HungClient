// EChartComponent.jsx
import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import { GridComponent } from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

// Đăng ký các thành phần ECharts
echarts.use([GridComponent, BarChart, CanvasRenderer]);

const EChartComponent = ({ data }) => {
    const chartRef = useRef(null);
    useEffect(() => {
        const chartDom = chartRef.current;
        const myChart = echarts.init(chartDom);
        const option = {
            xAxis: {
                type: 'category',
                data: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data: data,
                    type: 'bar',
                    showBackground: true,
                    backgroundStyle: {
                        color: 'rgba(180, 180, 180, 0.2)'
                    }
                }
            ]
        };

        option && myChart.setOption(option);
        return () => {
            myChart.dispose();
        };
    }, []);

    return (
        <div
            ref={chartRef}
            style={{ height: '600px' }} // Set the dimensions of the chart
        />
    );
};

export default EChartComponent;
