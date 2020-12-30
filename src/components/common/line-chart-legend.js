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
import moment from 'moment';

function LineChartLegendFactory() {
  const LineChartLegend = ({
    lineChart,
    visState
  }) => {

    const layerId = visState?.clickedLayer?.layer.id;

    const filterField = useMemo(() => {
      let selectedLayer = visState.layers.find(layers => layers.id == layerId);
      let filter = {
        index: selectedLayer?.config.sizeField?.tableFieldIndex,
        aggregate: selectedLayer?.config.visConfig.sizeAggregation
      }
      return filter
    }, [layerId]);

    const data = lineChart.map((item) => {
      item.value = item.data[filterField.index - 1]
      // item.time = item.data[8]
      item.time = moment(item.data[8]).format('YYYY-MM-dd HH:mm:ss');
      // item.time = new Date(new Date(item.data[8]).setMilliseconds(0)).toString()
      item.enodeb = item.data[11]
      return {value: item.value, time: item.time, enodeb: item.enodeb}
    });

    const groups = data.reduce(function (r, o) {
      var k = o.time + o.enodeb;
      if (r[k]) {
          if (o.value) (r[k].value += o.value) && ++r[k].average;
      } else {
          r[k] = o; 
          r[k].average = 1; // taking 'Average' attribute as an items counter(on the first phase)
      }
      return r;
    }, {});
    
    // getting "average of Points"    
    const result = Object.keys(groups).map(function (k) {
        const avg = groups[k].value/groups[k].average;
        groups[k].average = avg.toFixed(2)
        return groups[k];
    });
    
    const labels = Object.keys(_.groupBy(result, 'time'))
    console.log(labels)

    const dataset = _.groupBy(result, 'enodeb');
    const enodebIds = Object.keys(dataset)

    const values = Object.values(dataset).map((item) => {
      const val = Object.values(item).map((subitem) => {
        return labels.includes(subitem.time) ? subitem.average : null
      })
      return val
    });

    const series = [];
    for (var i = 0; i < enodebIds.length; i++)
    {
      const item = {
        name: enodebIds[i],
        type: 'line',
        data: values[i]
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
        },
        y: {
          formatter: function (y) {
            if (typeof y != null && typeof y != undefined) {
              return y.toFixed(2);
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
