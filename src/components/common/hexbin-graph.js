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

import React, { Component } from 'react';
import ReactHighcharts from 'react-highcharts';
import _ from 'lodash';
import { mean, min, max, median, deviation, variance, sum } from 'd3-array';

function HexbinGraphFactory() {
  class HexbinGraph extends Component {
    static chartState = {
      index: null,
      aggregation: null,
      visState: { object: { points: [] } },
    };

    shouldComponentUpdate(nextProps) {
      const { index: newIdx, aggregation: newAggr, visState: { object: { points: newPoints } } } = nextProps;
      const { index: oldIdx, aggregation: oldAggr, visState: { object: { points: oldPoints } } } = HexbinGraph.chartState;
      HexbinGraph.chartState = { index: newIdx, aggregation: newAggr, visState: nextProps.visState };

      if (oldIdx != newIdx) {
        return true;
      }
      
      if (oldAggr != newAggr) {
        return true;
      }

      if (JSON.stringify(oldPoints) != JSON.stringify(newPoints)) {
        return true;
      }

      return false;
    }

    render() {
      const {
        visState,
        index,
        aggregation,
        ymin,
        ymax,
        cellnames
      } = this.props;

      const lineChart = visState?.object?.points;

      const data = (lineChart != undefined) ? lineChart.map((item) => {
        item.value = item.data[index - 1];
        item.time = item.data[8]
        // item.time = moment(item.data[8]).format('YYYY-MM-dd HH:mm:ss');
        // item.time = new Date(new Date(item.data[8]).setMilliseconds(0)).toString()
        item.enodeb = item.data[11]
        return { value: item.value, time: item.time, enodeb: item.enodeb }
      }) : [];

      let result = data.reduce(function (r, o) {
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

      const labels = Object.keys(_.groupBy(result, 'time')).map(item => {return new Date(item).getTime()});
      const diff = max(labels) - min(labels);
      let startDate, endDate, flag = false;

      Object.keys(result).forEach(function(k) {
        // calculate aggregation values
        result[k].average = result[k].value != undefined ? mean(result[k].values).toFixed(2) : null;
        result[k].max = result[k].value != undefined ? max(result[k].values).toFixed(2) : null;
        result[k].min = result[k].value != undefined ? min(result[k].values).toFixed(2) : null;
        result[k].median = result[k].value != undefined ? median(result[k].values).toFixed(2) : null;
        result[k].sum = result[k].value != undefined ? sum(result[k].values).toFixed(2) : null;
        result[k].stdev = result[k].values.length > 1 ? deviation(result[k].values).toFixed(2) : 0;
        result[k].v = result[k].values.length > 1 ? variance(result[k].values).toFixed(2) : 0;

        // groupBy time with "some fixed values starting with 1h then like 4h, 1d, 4d, 10d, 1m, 3month"
        let t = new Date(result[k].time)
        if (diff > 3600000 * 24 * 30 * 36) {
          // groupBy 3-month
          result[k].groupTime = new Date(t.getFullYear(), Math.floor( t.getMonth() / 3 ) * 3).getTime()
          if (!flag) {
            t = new Date(min(labels) - 3600000 * 24 * 30 * 3)
            startDate = new Date(t.getFullYear(), Math.floor( t.getMonth() / 3 ) * 3).getTime()
            t = new Date(max(labels) + 3600000 * 24 * 30 * 3)
            endDate = new Date(t.getFullYear(), Math.floor( t.getMonth() / 3 ) * 3).getTime()
          }
        } else if (diff > 3600000 * 24 * 30 * 12) {
          // groupBy 1-month
          result[k].groupTime = new Date(t.getFullYear(), t.getMonth()).getTime()
          if (!flag) {
            t = new Date(min(labels) - 3600000 * 24 * 30)
            startDate = new Date(t.getFullYear(), t.getMonth()).getTime()
            t = new Date(max(labels) + 3600000 * 24 * 30)
            endDate = new Date(t.getFullYear(), t.getMonth()).getTime()
          }
        } else if (diff > 3600000 * 24 * 30 * 3) {
          // groupBy 10-days
          result[k].groupTime = new Date(t.getFullYear(), t.getMonth(), Math.floor(( min(t.getDate(), 30) - 1 ) / 10 ) * 10 + 1).getTime()
          if (!flag) {
            t = new Date(min(labels) - 3600000 * 24 * 10)
            startDate = new Date(t.getFullYear(), t.getMonth(), Math.floor(( min(t.getDate(), 30) - 1 ) / 10 ) * 10 + 1).getTime()
            t = new Date(max(labels) + 3600000 * 24 * 10)
            endDate = new Date(t.getFullYear(), t.getMonth(), Math.floor(( min(t.getDate(), 30) - 1 ) / 10 ) * 10 + 1).getTime()
          }
        } else if (diff > 3600000 * 24 * 30) {
          // groupBy 4-days
          result[k].groupTime = new Date(t.getFullYear(), t.getMonth(), Math.floor(( t.getDate() - 1 ) / 4 ) * 4 + 1).getTime()
          if (!flag) {
            t = new Date(min(labels) - 3600000 * 24 * 4)
            startDate = new Date(t.getFullYear(), t.getMonth(), Math.floor(( t.getDate() - 1 ) / 4 ) * 4 + 1).getTime()
            t = new Date(max(labels) + 3600000 * 24 * 4)
            endDate = new Date(t.getFullYear(), t.getMonth(), Math.floor(( t.getDate() - 1 ) / 4 ) * 4 + 1).getTime()
          }
        } else if (diff > 3600000 * 24 * 6) {
          // groupBy 1-days
          result[k].groupTime = new Date(t.getFullYear(), t.getMonth(), t.getDate()).getTime()
          if (!flag) {
            t = new Date(min(labels) - 3600000 * 24)
            startDate = new Date(t.getFullYear(), t.getMonth(), t.getDate()).getTime()
            t = new Date(max(labels) + 3600000 * 24)
            endDate = new Date(t.getFullYear(), t.getMonth(), t.getDate()).getTime()
          }
        } else if (diff > 3600000 * 24 * 2) {
          // groupBy 4-hours
          result[k].groupTime = new Date(t.getFullYear(), t.getMonth(), t.getDate(), Math.floor( t.getHours() / 4 ) * 4).getTime()
          if (!flag) {
            t = new Date(min(labels) - 3600000 * 4)
            startDate = new Date(t.getFullYear(), t.getMonth(), t.getDate(), Math.floor( t.getHours() / 4 ) * 4).getTime()
            t = new Date(max(labels) + 3600000 * 4)
            endDate = new Date(t.getFullYear(), t.getMonth(), t.getDate(), Math.floor( t.getHours() / 4 ) * 4).getTime()
          }
        } else {
          // groupBy 1-hour
          result[k].groupTime = new Date(t.getFullYear(), t.getMonth(), t.getDate(), t.getHours()).getTime()
          if (!flag) {
            t = new Date(min(labels) - 3600000)
            startDate = new Date(t.getFullYear(), t.getMonth(), t.getDate(), t.getHours()).getTime()
            t = new Date(max(labels) + 3600000)
            endDate = new Date(t.getFullYear(), t.getMonth(), t.getDate(), t.getHours()).getTime()
          }
        }
        flag = true;
      })

      const smps = Object.values(_.groupBy(result, 'enodeb')).map(item => {return {"key": item[0].enodeb, "value": item.length}});

      result = Object.values(result).reduce(function (r, o) {
        var k = o.groupTime;
        if (r[k]) {
          if (o.value) {
            r[k].valuesByTime.push(o.value);
            r[k].averageByTime.push(o.average);
            r[k].sumByTime.push(o.sum);
            r[k].maxByTime.push(o.max);
            r[k].minByTime.push(o.min);
            r[k].stdevByTime.push(o.stdev);
            r[k].vByTime.push(o.v);
          }
        } else {
            r[k] = o;
            r[k].valuesByTime = [o.value]; 
            r[k].averageByTime = [o.average]; // taking 'Minimum' attribute as an items counter(on the first phase)
            r[k].sumByTime = [o.sum]; // taking 'Minimum' attribute as an items counter(on the first phase)
            r[k].maxByTime = [o.max]; // taking 'Maximum' attribute as an items counter(on the first phase)
            r[k].minByTime = [o.min]; // taking 'Minimum' attribute as an items counter(on the first phase)
            r[k].medianByTime = [o.median]; // taking 'Minimum' attribute as an items counter(on the first phase)
            r[k].stdevByTime = [o.stdev]; // taking 'Stdev' attribute as an items counter(on the first phase)
            r[k].vByTime = [o.v]; // taking 'variance' attribute as an items counter(on the first phase)
        }
        return r;
      }, {});

      const dataset = _.groupBy(result, 'enodeb');
      const enodebIds = Object.keys(dataset)

      const yvalues = [];
      for (var i of enodebIds) {
        yvalues[i] = []
        yvalues[i].push({
          x: endDate,
          y: -0x3f3f3f3f
        })
        for (var k of dataset[i]) {
          let v = {
            x: k.groupTime
          };
          switch (aggregation) {
          case 'maximum':
            v.y = max(k.maxByTime);
            break;
          case 'minimum':
            v.y = min(k.minByTime);
            break;
          case 'median':
            v.y = median(k.medianByTime);
            break;
          case 'sum':
            v.y = sum(k.sumByTime);
            break;
          case 'stdev':
            v.y = deviation(k.stdevByTime);
            break;
          case 'variance':
            v.y = variance(k.vByTime);
            break;
          default:
            v.y = mean(k.averageByTime);
          }
          yvalues[i].push(v);
        }
        yvalues[i].push({
          x: startDate,
          y: -0x3f3f3f3f
        })
      }

      const colors = ['#2E93fA', '#66DA26', '#FF9800', '#7E36AF', '#00ECFF', '#f0ec26', '#E91E63'];

      const series = [];
      const annos = [];
      let iter = 0;

      for (var ids of enodebIds) {
        const item = {
          name: ids,
          type: 'line',
          data: yvalues[ids]
        }
        const anno = {
          value: mean( yvalues[ids].map(it => { return it.y }).slice(1, yvalues[ids].length - 1) ),
          color: colors[iter++],
          dashStyle: 'shortdash',
          width: 1,
          id: ids
        }
        series.push(item);
        annos.push(anno);
      }

      const withZero = num => {
        if (num < 10)
          return '0' + num;
        return num;
      }

      const config = {
        chart: {
          height: 350,
          type: 'line',
          backgroundColor: '#29323c'
        },
        title: {
          text: null
        },
        colors: colors,
        xAxis: {
          type: 'datetime',
          lineWidth: 1,
          lineColor: '#4e5053',
          gridLineWidth: 1,
          gridLineColor: '#4e5053',
          labels: {
            style: {
              color: '#e3e3e3'
            }
          }
        },
        yAxis: {
          tickAmount: 6,
          title: {
            text: null
          },
          min: aggregation == 'average' || aggregation == 'minimum' || aggregation == 'maximum' ? ymin : undefined,
          max: aggregation == 'average' || aggregation == 'minimum' || aggregation == 'maximum' ? ymax : undefined,
          lineWidth: 0,
          lineColor: '#4e5053',
          gridLineWidth: 1,
          gridLineColor: '#4e5053',
          labels: {
            style: {
              color: '#e3e3e3'
            }
          },
          plotLines: annos
        },
        series: series,
        plotOptions: {
          series: {
            step: 'center',
            animation: {
              duration: 0
            }
          },
          line: {
            events: {
              legendItemClick: function () {
                annos.filter(item => item.id === this.name)[0].width ^= 1;
                this.yAxis.update({
                  plotLines: annos
                })
              }
            }
          }
        },
        legend: {
          align: 'right',
          verticalAlign: 'middle',
          itemStyle: {
            color: '#e3e3e3',
          },
          layout: 'vertical',
          useHTML: true,
          itemHiddenStyle: { "color": "#616b75" },
          labelFormatter: function () {
            const color = this.color;
            const val = this.yData;
            return cellnames[this.name] + "<br/><span style='padding-left:3em'>" + 
                "<span style='color:" + color + "'>#min:</span>" + min(val.slice(1, val.length - 1)).toFixed(2) + 
                "<span style='color:" + color + "'>#max:</span>" + max(val.slice(1, val.length - 1)).toFixed(2) + 
                "<span style='color:" + color + "'>#avg:</span>" + mean(val.slice(1, val.length - 1)).toFixed(2) + 
                "<span style='color:" + color + "'>#smp:</span>" + smps.filter(item => item.key === this.name)[0].value +
              "</span>";
          }
        },
        tooltip: {
          shared: true,
          backgroundColor: '#232630',
          borderColor: '#19222c',
          style: {
            color: '#e3e3e3'
          },
          xDateFormat: '%Y-%m-%d %H:00',
          useHTML: true,
          headerFormat: '<center>{point.key}</center><table>',
          pointFormat: '<tr><td style="color: {series.color}">{series.name}: </td>' +
            '<td style="text-align: right">{point.y}</td></tr>',
          footerFormat: '</table>',
          valueDecimals: 2
        }
      }

      return (
        <ReactHighcharts config={config} />
      );
    }
  }

  return HexbinGraph;
}

export default HexbinGraphFactory;
