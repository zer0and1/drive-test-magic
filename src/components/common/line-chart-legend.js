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
import {mean, min, max, median, deviation, variance, sum} from 'd3-array';
import moment from 'moment';

function LineChartLegendFactory() {
  const LineChartLegend = ({
    visState,
    index,
    aggregation
  }) => {

    const lineChart = visState?.object?.points;

    const data = (lineChart != undefined) ? lineChart.map((item) => {
      item.value = item.data[index-1];
      item.time = item.data[8]
      // item.time = moment(item.data[8]).format('YYYY-MM-dd HH:mm:ss');
      // item.time = new Date(new Date(item.data[8]).setMilliseconds(0)).toString()
      item.enodeb = item.data[11]
      return {value: item.value, time: item.time, enodeb: item.enodeb}
    }) : [];

    const result = data.reduce(function (r, o) {
      var k = o.time + o.enodeb;
      if (r[k]) {
        if (o.value) r[k].values.push(o.value);
      } else {
          r[k] = o;
          r[k].values = [o.value]; 
          r[k].average = o.value; // taking 'Minimum' attribute as an items counter(on the first phase)
          r[k].sum = o.value; // taking 'Minimum' attribute as an items counter(on the first phase)
          r[k].max = o.value; // taking 'Maximum' attribute as an items counter(on the first phase)
          r[k].min = o.value; // taking 'Minimum' attribute as an items counter(on the first phase)
          r[k].median = o.value; // taking 'Minimum' attribute as an items counter(on the first phase)
          r[k].stdev = 0; // taking 'Stdev' attribute as an items counter(on the first phase)
          r[k].v = 0; // taking 'variance' attribute as an items counter(on the first phase)
      }
      return r;
    }, {});

    Object.keys(result).forEach(function(k) {
      result[k].average = result[k].value != undefined ? mean(result[k].values).toFixed(2) : null;
      result[k].max = result[k].value != undefined ? max(result[k].values).toFixed(2) : null;
      result[k].min = result[k].value != undefined ? min(result[k].values).toFixed(2) : null;
      result[k].median = result[k].value != undefined ? median(result[k].values).toFixed(2) : null;
      result[k].sum = result[k].value != undefined ? sum(result[k].values).toFixed(2) : null;
      result[k].stdev = result[k].values.length > 1 ? deviation(result[k].values).toFixed(2) : 0;
      result[k].v = result[k].values.length > 1 ? variance(result[k].values).toFixed(2) : 0;
    })

    const labels = Object.keys(_.groupBy(result, 'time'));

    const dataset = _.groupBy(result, 'enodeb');
    const enodebIds = Object.keys(dataset)

    const yvalues = [];
    for (var i of enodebIds) {
      yvalues[i] = []
      for (var k of labels) {
        const v = null;
        switch (aggregation) {
          case 'maximum':
            v = result[k+i] !== undefined ? result[k+i]?.max : null;
            break;
          case 'minimum':
            v = result[k+i] !== undefined ? result[k+i]?.min : null;
            break;
          case 'median':
            v = result[k+i] !== undefined ? result[k+i]?.median : null;
            break;
          case 'sum':
            v = result[k+i] !== undefined ? result[k+i]?.sum : null;
            break;
          case 'stdev':
            v = result[k+i] !== undefined ? result[k+i]?.stdev : null;
            break;
          case 'variance':
            v = result[k+i] !== undefined ? result[k+i]?.v : null;
            break;
          default:
            v = result[k+i] !== undefined ? result[k+i]?.average : null;
          }
        yvalues[i].push(v);
      }
    }

    const series = [];
    for (var ids of enodebIds)
    {
      const item = {
        name: ids,
        type: 'line',
        data: yvalues[ids]
      }
      series.push(item)
    }
  
    const options = {
      chart: {
        height: 350,
        type: 'line',
        stacked: false,
        foreColor: '#c3c3c3',
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        }
      },
      stroke: {
        width: 2,
        curve: 'straight'
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
      labels: labels,
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
