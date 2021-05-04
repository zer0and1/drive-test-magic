// Copyright (c) 2021 Uber Technologies, Inc.
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
import {HEXBIN_GRAPH_COLORS} from 'constants/default-settings';

let chartConfig = {
  type: 'line',
  globals: {
    fontFamily: "ff-clan-web-pro,'Helvetica Neue',Helvetica,sans-serif",
    shadow: false
  },
  options: {},
  theme: 'dark',
  backgroundColor: "#29323c",
  plotarea: {
    margin: 'dynamic'
  },
  crosshairX: {},
  plot: {
    highlight: true,
    tooltipText: "%t views: %v<br>%k",
    shadow: 0,
    aspect: 'jumped',
    marker: {
      size: 0,
      'border-width': 0
    }
  },
  scaleX: {
    transform: {
      type: "date",
      all: "%d %M, %H:00"
    },
    guide: {
      visible: true
    },
    item: {
      fontColor: '#A0A7B4'
    },
    lineColor: '#A0A7B4',
    lineWidth: '1px',
    maxItems: 8,
    tick: {
      lineColor: '#A0A7B4',
      lineWidth: '1px'
    },
    zooming: true
  },
  scaleY: {
    guide: {
      lineColor: '#4e5053',
      lineStyle: 'solid'
    },
    item: {
      fontColor: '#A0A7B4'
    },
    lineColor: '#A0A7B4',
    lineWidth: '1px',
    tick: {
      lineColor: '#A0A7B4',
      lineWidth: '1px'
    },
    markers: []
  },
  legend: {
    adjustLayout: true,
    marginTop: -20,
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    item: {
      fontColor: '#A0A7B4'
    },
    marker: {
      borderColor: 'transparent',
      borderRadius: '50px'
    }
  },
  tooltip: {
    visible: false
  },
  series: []
}


function HexbinGraphFactory() {
  class HexbinGraph extends Component {
    static chartState = {};

    shouldComponentUpdate(nextProps) {
      if (JSON.stringify(nextProps) != JSON.stringify(HexbinGraph.chartState)) {
        HexbinGraph.chartState = nextProps;
        return true;
      }

      return false;
    }

    render() {
      const {
        groups,
        ymin,
        ymax,
        groupTimes
      } = this.props;

      let series = [];
      let markers = [];
      let iter = 0;

      for (let group of Object.values(groups)) {
        const {enodeb, count, avg, min, max, values, cellName} = group;
        const color = HEXBIN_GRAPH_COLORS[iter] || HEXBIN_GRAPH_COLORS[0];
        const item = {
          text: enodeb,
          lineWidth: 10,
          lineColor: color,
          marker: {
            backgroundColor: color
          },
          legendText: cellName + "(<span style='color:" + color + "'>#samples: </span>" + count + ") <br/>" +
            "<span style='color:" + color + "'>#avg:</span>" + avg +
            "<span style='color:" + color + "'>&nbsp;#max:</span>" + max +
            "<span style='color:" + color + "'>&nbsp;#min:</span>" + min,
          values: values,
          samples: count // only needed for sorting series
        }
        const marker = {
          type: 'line',
          range: [avg],
          lineColor: color,
          lineStyle: 'dashed',
          alpha: 1,
          id: enodeb
        }
        series.push(item);
        markers.push(marker);
        iter++;
      }

      series = series.sort((a, b) => b.samples - a.samples);

      chartConfig = {
        ...chartConfig,
        scaleX: {
          ...chartConfig.scaleX,
          values: groupTimes
        },
        scaleY: {
          ...chartConfig.scaleY,
          minValue: ymin,
          maxValue: ymax,
          markers
        },
        series
      }

      let key = false;
      document.addEventListener('keydown', function (event) {
        if (event.shiftKey) key = true;
      })
      document.addEventListener('keyup', function (event) {
        key = false;
      })

      const legendItemClick = (e) => {
        chartConfig.scaleY.markers.filter(item => item.id === e.plottext)[0].alpha ^= 1;
        if (key) {
          key = false;
          Object.values(chartConfig.scaleY.markers).forEach(function (k) {
            k.alpha ^= 1
          })
        }
        zingchart.exec('hexbinGraph', 'modify', {
          data: {
            scaleY: chartConfig.scaleY
          }
        });
      }

      return (
        <ZingChart
          id='hexbinGraph'
          height={350}
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
