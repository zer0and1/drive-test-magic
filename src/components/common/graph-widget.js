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
import styled from 'styled-components';

import {
  SelectTextBold,
  IconRoundSmall,
  CenterFlexbox,
  BottomWidgetInner
} from './styled-components';
import { Close, LineChart } from './icons';
import HexbinGraphFactory from './hexbin-graph';
import { min, max } from 'd3-array';

const TOP_SECTION_HEIGHT = '36px';

const GraphBottomWidgetInner = styled(BottomWidgetInner)`
  padding: 6px 16px 0px 16px;
`;
const TopSectionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  color: ${props => props.theme.labelColor};
  height: ${TOP_SECTION_HEIGHT};
`;

const StyledTitle = styled(CenterFlexbox)`
  flex-grow: 0;
  color: ${props => props.theme.textColor};
  margin-right: 10px;

  .bottom-widget__icon {
    margin-right: 6px;
  }
  .bottom-widget__icon.speed {
    margin-right: 0;
  }
`;

GraphWidgetFactory.deps = [HexbinGraphFactory]

function GraphWidgetFactory(HexbinGraph) {
  class GraphWidget extends Component {

    render() {
      const {
        showGraphState,
        visState,
        layers,
        allData,
        fields
      } = this.props;

      const enodebField = fields && fields.find(f => f.name == "enodeb_id");
      
      if (!enodebField) {
        return null;
      }
      
      const layerId = visState?.layer?.id;
      const layer = layers.find(item => item.id === layerId);
      const fieldName = layer?.config?.colorField?.name;
      const fieldIndex = layer?.config?.colorField?.tableFieldIndex;
      const aggregation = layer?.config?.visConfig?.colorAggregation;
      

      const ymin = min(allData.map(function (el) { return el[fieldIndex - 1] }));
      const ymax = max(allData.map(function (el) { return el[fieldIndex - 1] }));
      const cellnames = allData.reduce(function (r, o) {
        if (!r[o[11]])
          r[o[11]] = o[4];
        return r;
      }, []);

      const pos = visState.coordinate;

      // calculate lenght of bins
      const lineChart = visState?.object?.points;
      if (lineChart == undefined) return;

      const timePeriod = Object.values(lineChart).map(item => new Date(item.data?.[8]).getTime());

      let st = new Date(min(timePeriod));
      const starttime = new Date(st.getFullYear(), st.getMonth(), st.getDate(), st.getHours()).getTime()
      st = new Date(max(timePeriod));
      const endtime = new Date(st.getFullYear(), st.getMonth(), st.getDate(), st.getHours()).getTime()

      const diff = endtime - starttime;

      let bins = 1;
      for (bins of [1, 4, 8, 24, 48, 96, 168, 336, 730])
        if (diff / 3600000 / bins < 42) break;

      return (
        <GraphBottomWidgetInner className="bottom-widget--inner">
          <TopSectionWrapper>
            <CenterFlexbox />
            <StyledTitle className="bottom-widget__field">
              <CenterFlexbox className="bottom-widget__icon">
                <LineChart height="15px" />
              </CenterFlexbox>
              <SelectTextBold>History Trend for {fieldName} @ {pos[0].toFixed(6)}N {pos[1].toFixed(6)}E ({bins}h bins)</SelectTextBold>
            </StyledTitle>
            <CenterFlexbox>
              <IconRoundSmall>
                <Close height="12px" onClick={showGraphState} />
              </IconRoundSmall>
            </CenterFlexbox>
          </TopSectionWrapper>
          <HexbinGraph
            lineChart={lineChart}
            index={fieldIndex}
            enodebFieldIndex={enodebField.tableFieldIndex - 1}
            aggregation={aggregation}
            ymin={ymin}
            ymax={ymax}
            cellnames={cellnames}
            starttime={starttime}
            endtime={endtime}
            bins={bins}
          />
        </GraphBottomWidgetInner>
      );
    }
  }
  return GraphWidget;
}

export default GraphWidgetFactory;
