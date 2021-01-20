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
import zingchart from 'zingchart/es6';
import ZingChart from 'zingchart-react';
import _ from 'lodash';
import { mean, min, max, median, deviation, variance, sum } from 'd3-array';

const colors = ['#2E93fA', '#66DA26', '#FF9800', '#7E36AF', '#00ECFF', '#f0ec26', '#E91E63'];

let chartConfig = {
  type: 'line',
  options: {
    contextMenu: {
      visible: true
    },
  },
  theme: 'dark',
  backgroundColor:"#29323c",
  plot: {
    aspect: 'jumped'
  },
  scaleX: {
    transform: {
      type: "date",
      all: "%d %M, %H:00"
    },
    guide: {
      lineColor: '#4e5053',
      visible: true
    },
    labels: []
  },
  crosshairX: {
    // plotLabel: {
    //   headerText: '%kl<br/>'
    // },
    // scaleLabel: {
    //   visible: false
    // }
  },
  scaleY: {
    guide: {
      lineColor: '#4e5053'
    },
    markers: []
  },
  legend: {
    align: 'right',
    verticalAlign: 'top'
  },
  tooltip: {
    visible: false
  },
  series: []
}


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

      const timePeriod = (lineChart != undefined) ? 
                          Object.values(lineChart).map(item => {return new Date(item.data[8]).getTime()}) :
                          undefined;
      const diff = (timePeriod != undefined) ? max(timePeriod) - min(timePeriod) : 0;

      let func = (t => {
        if (diff > 3600000 * 24 * 30 * 36) {
          // groupBy 3-month
          return new Date(t.getFullYear(), Math.floor( t.getMonth() / 3 ) * 3).getTime()
        }
        if (diff > 3600000 * 24 * 30 * 12) {
          // groupBy 1-month
          return new Date(t.getFullYear(), t.getMonth()).getTime()
        }
        if (diff > 3600000 * 24 * 30 * 3) {
          // groupBy 10-days
          return new Date(t.getFullYear(), t.getMonth(), Math.floor(( min(t.getDate(), 30) - 1 ) / 10 ) * 10 + 1).getTime()
        }
        if (diff > 3600000 * 24 * 30) {
          // groupBy 4-days
          return new Date(t.getFullYear(), t.getMonth(), Math.floor(( t.getDate() - 1 ) / 4 ) * 4 + 1).getTime()
        }
        if (diff > 3600000 * 24 * 6) {
          // groupBy 1-days
          return new Date(t.getFullYear(), t.getMonth(), t.getDate()).getTime()
        }
        if (diff > 3600000 * 24 * 2) {
          // groupBy 4-hours
          return new Date(t.getFullYear(), t.getMonth(), t.getDate(), Math.floor( t.getHours() / 4 ) * 4).getTime()
        }
        // groupBy 1-hour
        return new Date(t.getFullYear(), t.getMonth(), t.getDate(), t.getHours()).getTime()
      });

      const data = (lineChart != undefined) ? lineChart.map((item) => {
        const obj = {
          value : item.data[index - 1],
          enodeb : item.data[11],

          // groupBy time with "some fixed values starting with 1h then like 4h, 1d, 4d, 10d, 1m, 3month"
          groupTime : func(new Date(item.data[8]))
        }

        return obj
      }) : [];

      let result = data.reduce(function (r, o) {
        var k = o.groupTime + o.enodeb;
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
        // calculate aggregation values
        result[k].average = result[k].value != undefined ? mean(result[k].values).toFixed(2) : null;
        result[k].max = result[k].value != undefined ? max(result[k].values).toFixed(2) : null;
        result[k].min = result[k].value != undefined ? min(result[k].values).toFixed(2) : null;
        result[k].median = result[k].value != undefined ? median(result[k].values).toFixed(2) : null;
        result[k].sum = result[k].value != undefined ? sum(result[k].values).toFixed(2) : null;
        result[k].stdev = result[k].values.length > 1 ? deviation(result[k].values).toFixed(2) : 0;
        result[k].v = result[k].values.length > 1 ? variance(result[k].values).toFixed(2) : 0;
      })

      const smps = Object.values(_.groupBy(data, 'enodeb')).map(item => {return {"key": item[0].enodeb, "value": item.length}});

      const dataset = _.groupBy(result, 'enodeb');
      const enodebIds = Object.keys(dataset)

      const labels = Object.keys(_.groupBy(result, 'groupTime')).reverse()

      const yvalues = [];
      for (var i of enodebIds) {
        yvalues[i] = []
        for (var k of labels) {
          let v = null;
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
      const annos = [];
      let iter = 0;

      for (var ids of enodebIds) {
        const item = {
          text: ids,
          lineWidth: 10,
          lineColor: colors[iter],
          marker: {
            backgroundColor: colors[iter]
          },
          legendText: cellnames[ids] + "<br/>" + 
                      "<span style='color:" + colors[iter] + "'>#avg:</span>" + mean(yvalues[ids]).toFixed(2) + 
                      "<span style='color:" + colors[iter] + "'>#max:</span>" + max(yvalues[ids]) + 
                      "<span style='color:" + colors[iter] + "'>#min:</span>" + min(yvalues[ids]) + 
                      "<span style='color:" + colors[iter] + "'>#smp:</span>" + smps.filter(item => item.key === ids)[0].value,
          values: yvalues[ids].map(num => num != null ? Number(num) : null)
        }
        const anno = {
          type: 'line',
          range: [mean( yvalues[ids] )],
          lineColor: colors[iter++],
          lineStyle: 'dashed',
          alpha: 1,
          id: ids
        }
        series.push(item);
        annos.push(anno);
      }

      chartConfig = {
        ...chartConfig,
        scaleX: {
          ...chartConfig.scaleX,
          labels: labels
        },
        scaleY: {
          ...chartConfig.scaleY,
          minValue: ymin,
          maxValue: ymax,
          markers: annos
        },
        series: series
      }

      const legendItemClick = (e) => {
        chartConfig.scaleY.markers.filter(item => item.id === e.plottext)[0].alpha ^= 1;
        zingchart.exec('hexbinGraph', 'modify', {
          data : {
            scaleY: chartConfig.scaleY
          }
        });
      }

      return (
        <ZingChart
          id='hexbinGraph'
          data={chartConfig}
          legend_item_click={legendItemClick}
          legend_marker_click={legendItemClick}
        />
      );
    }
  }

  return HexbinGraph;
}

export default HexbinGraphFactory;
