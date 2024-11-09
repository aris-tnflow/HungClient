import React, { useEffect } from 'react';
import * as echarts from 'echarts/core';
import { GraphicComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([GraphicComponent, CanvasRenderer]);

const EChartsComponent = ({ text, fontSize }) => {
    useEffect(() => {
        const chartDom = document.getElementById('main');
        const myChart = echarts.init(chartDom);

        const option = {
            graphic: {
                elements: [
                    {
                        type: 'text',
                        left: 'center',
                        top: 'center',
                        style: {
                            text: text,
                            fontSize: fontSize,
                            fontWeight: 'bold',
                            lineDash: [0, 200],
                            lineDashOffset: 0,
                            fill: 'transparent',
                            stroke: '#ffbe00',
                            lineWidth: 1
                        },
                        keyframeAnimation: {
                            duration: 2500,
                            loop: true,
                            keyframes: [
                                {
                                    percent: 0.7,
                                    style: {
                                        fill: 'transparent',
                                        lineDashOffset: 200,
                                        lineDash: [200, 0]
                                    }
                                },
                                {
                                    percent: 0.7,
                                    style: {
                                        fill: 'transparent'
                                    }
                                },
                                {
                                    percent: 0.8,
                                    style: {
                                        fill: '#ffbe00'
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        };

        myChart.setOption(option);
        return () => {
            myChart.dispose();
        };
    }, []);

    return <div id="main" style={{ width: '300px', height: '46px' }}></div>;
};

export default EChartsComponent;
