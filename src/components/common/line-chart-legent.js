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
import moment from 'moment';
import {
  HorizontalGridLines,
  LineSeries,
  XYPlot,
  CustomSVGSeries,
  Hint,
  YAxis,
  MarkSeries
} from 'react-vis';
import styled from 'styled-components';
import {getTimeWidgetHintFormatter} from 'utils/filter-utils';

const LineChartWrapper = styled.div`
  .rv-xy-plot {
    /* important for rendering hint */
    position: relative;
  }
  .rv-xy-plot__inner {
    /* important to show axis */
    overflow: visible;
  }

  .rv-xy-plot__grid-lines__line {
    stroke: ${props => props.theme.histogramFillOutRange};
    stroke-dasharray: 1px 4px;
  }

  .rv-xy-plot__axis__tick__text {
    font-size: 9px;
    fill: ${props => props.theme.textColor};
  }
`;

const MARGIN = {top: 0, bottom: 0, left: 0, right: 0};
function LineChartFactory() {
  const LineChart = ({
    brushComponent,
    brushing,
    color,
    enableChartHover,
    height,
    hoveredDP,
    isEnlarged,
    lineChart,
    margin,
    onMouseMove,
    width
  }) => {
    const {xDomain, series, yDomain} = lineChart;
    const hintFormatter = useMemo(() => {
      return getTimeWidgetHintFormatter(xDomain);
    }, [xDomain]);

    const brushData = useMemo(() => {
      return [{x: series[0].x, y: yDomain[1], customComponent: () => brushComponent}];
    }, [series, yDomain, brushComponent]);

    const labelFormatter = (value) => {
        let val = Math.abs(value);
        if (val >= 1000000) {
          val = (val / 1000000).toFixed(1) + " M";
        }
        return val;
      };


    const data = [
      {
        x: 1994,
        y: 2543763
      },
      {
        x: 1995,
        y: 4486659
      },
      {
        x: 1996,
        y: 7758386
      },
      {
        x: 1997,
        y: 12099221
      },
      {
        x: 1998,
        y: 18850762
      },
      {
        x: 1999,
        y: 28153765
      },
      {
        x: 2000,
        y: 41479495
      },
      {
        x: 2001,
        y: 50229224
      },
      {
        x: 2002,
        y: 66506501
      },
      {
        x: 2003,
        y: 78143598
      },
      {
        x: 2004,
        y: 91332777
      },
      {
        x: 2005,
        y: 103010128
      },
      {
        x: 2006,
        y: 116291681
      },
      {
        x: 2007,
        y: 137322698
      },
      {
        x: 2008,
        y: 157506752
      },
      {
        x: 2009,
        y: 176640381
      },
      {
        x: 2010,
        y: 202320297
      },
      {
        x: 2011,
        y: 223195735
      },
      {
        x: 2012,
        y: 249473624
      },
      {
        x: 2013,
        y: 272842810
      },
      {
        x: 2014,
        y: 295638556
      },
      {
        x: 2015,
        y: 318599615
      },
      {
        x: 2016,
        y: 342497123
      }
    ];
    
    const options = {
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },
      series: [
        {
          name: "Logarithmic",
          data: data
        },
        {
          name: "Linear",
          data: data
        }
      ],
    
      title: {
        text: "Logarithmic Scale",
        align: "center"
      },
      markers: {
        size: 0
      },
      xaxis: {
        type: "datetime"
      },
      yaxis: [
        {
          min: 1000000,
          max: 500000000,
          tickAmount: 4,
          logarithmic: true,
          seriesName: "Logarithmic",
          labels: {
            formatter: labelFormatter,
          }
        },
        {
          min: 1000000,
          max: 500000000,
          opposite: true,
          tickAmount: 4,
          seriesName: "Linear",
          labels: {
            formatter: labelFormatter
          }
        }
      ]
    };

    return (
      <LineChartWrapper style={{marginTop: `${margin.top}px`}}>
        <XYPlot
          xType="time"
          width={width}
          height={height}
          margin={MARGIN}
          onMouseLeave={() => {
            onMouseMove(null);
          }}
        >
          <HorizontalGridLines tickTotal={3} />
          <ApexCharts
            options = {options}
          />
        </XYPlot>
      </LineChartWrapper>
    );
  };
  return LineChart;
}

export default LineChartFactory;
