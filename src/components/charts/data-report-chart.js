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

const chartConfig = {
  type: 'mixed',
  globals: {
    fontFamily: 'Helvetica',
    shadow: false
  },
  theme: 'dark',
  backgroundColor: "#29323c",
  legend: {
    marginTop: '200px',
    // marginRight: '40px',
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    item: {
      fontColor: '#ffffff'
    },
    // layout: 'float',
    adjustLayout: true,
    marker: {
      borderColor: 'transparent',
      borderRadius: '50px'
    }
  },
  plot: {
    alphaArea: 0.4,
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
      fontColor: '#ffffff'
    },
    lineColor: '#ffffff',
    lineWidth: '1px',
    maxItems: 8,
    tick: {
      lineColor: '#ffffff',
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
      fontColor: '#ffffff'
    },
    lineColor: '#ffffff',
    lineWidth: '1px',
    tick: {
      lineColor: '#ffffff',
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
      }
    }

    shouldComponentUpdate(nextProps) {
      const {chartData} = nextProps;

      if (chartData && JSON.stringify(chartData) != JSON.stringify(this.props.chartData)) {
        zingchart.exec('data-report-chart', 'modify', {
          data: chartData
        });
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
