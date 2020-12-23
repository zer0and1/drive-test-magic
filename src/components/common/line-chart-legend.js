// Copyright (c) 2020 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React, {useMemo} from 'react';
import styled from 'styled-components';
import ApexCharts from "react-apexcharts";
import _ from 'lodash';

function LineChartLegendFactory() {
  const LineChartLegend = ({
    lineChart
  }) => {
    // const {xDomain, series, yDomain} = lineChart;
    // const hintFormatter = useMemo(() => {
    //   return getTimeWidgetHintFormatter(xDomain);
    // }, [xDomain]);

    // const brushData = useMemo(() => {
    //   return [{x: series[0].x, y: yDomain[1], customComponent: () => brushComponent}];
    // }, [series, yDomain, brushComponent]);

    // const labelFormatter = (value) => {
    //     let val = Math.abs(value);
    //     if (val >= 1000000) {
    //       val = (val / 1000000).toFixed(1) + " M";
    //     }
    //     return val;
    //   };

    console.log(lineChart)
    const dataset = _.groupBy(lineChart, 'enodeb_id');
    // console.log(dataset)

    const series = [{
      name: 'TEAM A',
      type: 'line',
      data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30]
    }, {
      name: 'TEAM B',
      type: 'line',
      data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43]
    }, {
      name: 'TEAM C',
      type: 'line',
      data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39]
    }];

    const options = {
      chart: {
        height: 350,
        type: 'line',
        stacked: false,
        foreColor: '#c3c3c3',
        toolbar: {
          show: false
        }
      },
      stroke: {
        width: 2,
        curve: 'smooth'
      },
      plotOptions: {
        bar: {
          columnWidth: '50%'
        }
      },
      grid: {
        show: true,
        borderColor: '#4e5053',
        strokeDashArray: 0,
        position: 'back',
        xaxis: {
            lines: {
                show: true
            }
        },   
        yaxis: {
            lines: {
                show: true
            }
        },  
        row: {
            colors: undefined,
            opacity: 0.5
        },  
        column: {
            colors: undefined,
            opacity: 0.5
        },  
        padding: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
        },  
      },  
      fill: {
        opacity: 1,
        gradient: {
          inverseColors: false,
          shade: 'light',
          type: "vertical",
          opacityFrom: 0.85,
          opacityTo: 0.55,
          stops: [0, 100, 100, 100]
        }
      },
      labels: ['01/01/2003', '02/01/2003', '03/01/2003', '04/01/2003', '05/01/2003', '06/01/2003', '07/01/2003', '08/01/2003', '09/01/2003', '10/01/2003', '11/01/2003'],
      markers: {
        size: 0
      },
      xaxis: {
        type: 'datetime',
        tooltip: {
          enabled: false
        }
      },
      tooltip: {
        shared: true,
        intersect: false,
        theme: 'dark',
        x: {
          formatter: function (x) {
            if (typeof x !== "undefined") {
              let current_datetime = new Date(x);
              let formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds() 
              return "<center>" + formatted_date + "</center>";
            }
            return x;
          }
        },
        y: {
          formatter: function (y) {
            if (typeof y !== "undefined") {
              return y.toFixed(0) + " points";
            }
            return y;
          }
        }
      },
      legend: {
        position: 'right',
        offsetY: 20
      }
    };

    return (
      <ApexCharts
        series={series}
        options={options}
        height={options.chart.height}
      />
    );
  };
  return LineChartLegend;
}

export default LineChartLegendFactory;
