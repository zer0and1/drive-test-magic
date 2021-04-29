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

import React, {Component} from 'react';
import zingchart from 'zingchart/es6';
import ZingChart from 'zingchart-react';
import moment from 'moment';

const chartConfig = {
  type: 'mixed',
  globals: {
    fontFamily: "ff-clan-web-pro,'Helvetica Neue',Helvetica,sans-serif",
    shadow: false
  },
  theme: 'dark',
  backgroundColor: "#29323c",
  legend: {
    marginTop: '150px',
    marginLeft: '800px',
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    item: {
      fontColor: '#A0A7B4'
    },
    adjustLayout: true,
    marker: {
      borderColor: 'transparent',
      borderRadius: '50px'
    }
  },
  plot: {
    alphaArea: 1,
    aspect: 'none',
    contourOnTop: true,
    lineWidth: '2px',
    marker: {
      visible: false
    }
  },
  scaleX: {
    guide: {
      visible: false
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
    transform: {
      type: 'date'
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
    }
  },
  crosshairX: {
    plotLabel: {
      backgroundColor: '#434343',
      fontColor: '#FFF'
    },
    scaleLabel: {
      backgroundColor: '#fff',
      borderColor: '#333',
      borderRadius: '3px',
      borderWidth: '1px',
      fontColor: 'black'
    }
  },
  tooltip: {
    visible: false
  },
  series: []
};

function DataReportChartFactory() {
  class DataReportChart extends Component {
    componentDidMount() {
      if (this.props.chartData) {
        zingchart.exec('data-report-chart', 'modify', {
          data: this.props.chartData
        });
        zingchart.exec('data-report-chart', 'viewall');
      }
    }

    shouldComponentUpdate(nextProps) {
      const {chartData} = nextProps;

      if (!chartData) {
        return false;
      }

      const ago = moment().diff(moment(chartData.timestamp), 'milliseconds');

      if (ago < 100) {
        zingchart.exec('data-report-chart', 'modify', {data: chartData});
        zingchart.exec('data-report-chart', 'viewall');
        return true;
      }

      return false;
    }

    render() {
      return (
        <ZingChart
          id='data-report-chart'
          height={360}
          data={chartConfig}
        />
      );
    }
  }

  return DataReportChart;
}

export default DataReportChartFactory;
