import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import {
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
    LegendComponent
} from 'echarts/components';
import { PieChart } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
    LegendComponent,
    PieChart,
    CanvasRenderer,
    LabelLayout
]);

const EChartsComponent = ({ data }) => {
    const chartRef = useRef(null);

    function getFormattedWeekRange() {
        const today = new Date();

        // Get the current day of the week (Monday is 1, Sunday is 0)
        const dayOfWeek = today.getDay() || 7; // Make Sunday (0) become 7

        // Get the first day of the week (Monday)
        const firstDay = new Date(today);
        firstDay.setDate(today.getDate() - dayOfWeek + 1);

        // Get the last day of the week (Sunday)
        const lastDay = new Date(firstDay);
        lastDay.setDate(firstDay.getDate() + 6);

        // Format the date as "day/month"
        const formatDate = (date) => {
            const day = date.getDate();
            const month = date.getMonth() + 1; // Months are zero-indexed, so +1 to get correct month
            return `${day}/${month}`;
        };

        return `${formatDate(firstDay)} - ${formatDate(lastDay)}`;
    }

    useEffect(() => {
        if (chartRef.current) {
            const myChart = echarts.init(chartRef.current);
            const option = {
                title: {
                    text: 'Tổng doanh thu tuần này',
                    subtext: `Ngày ${getFormattedWeekRange()}`,
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                    left: 'center',
                    top: 'bottom',
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
                        name: 'Area Mode',
                        type: 'pie',
                        radius: [20, 140],
                        center: ['50%', '50%'], // Đặt biểu đồ ở giữa
                        roseType: 'area',
                        itemStyle: {
                            borderRadius: 5
                        },
                        data: data
                    }
                ]
            };

            myChart.setOption(option);

            // Cleanup on unmount
            return () => {
                myChart.dispose();
            };
        }
    }, []);

    return <div ref={chartRef} style={{ width: '100%', height: '500px' }} />;
};

export default EChartsComponent;
