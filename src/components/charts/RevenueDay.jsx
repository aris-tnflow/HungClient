// EChartsPieChart.js
import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import {
    TitleComponent,
    TooltipComponent,
    LegendComponent
} from 'echarts/components';
import { PieChart } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    PieChart,
    CanvasRenderer,
    LabelLayout
]);

const RevenueDay = ({ data }) => {
    const chartRef = useRef(null);
    const formattedDate = (() => { const d = new Date(); return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`; })();

    useEffect(() => {
        const chartDom = chartRef.current;
        const myChart = echarts.init(chartDom);
        const option = {
            title: {
                text: 'Tổng doanh thu - Đơn đặt hàng',
                subtext: `Ngày ${formattedDate}`,
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            toolbox: {
                show: true,
                feature: {
                    mark: { show: true },
                    saveAsImage: { show: true }
                }
            },
            series: [
                {
                    name: 'Access From',
                    type: 'pie',
                    radius: '50%',
                    data: data,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

        myChart.setOption(option);

        // Clean up on component unmount
        return () => {
            myChart.dispose();
        };
    }, []);

    return <div ref={chartRef} style={{ width: '100%', height: '500px' }} />;
};

export default RevenueDay;
