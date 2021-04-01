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
import { createSelector } from 'reselect';

import {
  CenterFlexbox,
  BottomWidgetInner,
  PanelLabel,
  Button
} from 'components/common/styled-components';
import { Delete } from 'components/common/icons';
import DatasetSelectorFactory from './dataset-selector';
import FieldSelectorFactory from './field-selector';
import DataReportChartFactory from 'components/charts/data-report-chart';
import ItemSelector from 'components/common/item-selector/item-selector';

const TimeBottomWidgetInner = styled(BottomWidgetInner)`
  padding: 6px 32px 24px 32px;
`;
const TopSectionWrapper = styled.div`
  display: flex;
  -webkit-box-pack: justify;
  color: ${props => props.theme.labelColor};
  justify-content: space-between;

  #bottom-widget__field-select {
    width: 200px;
  }

  #bottom-widget__aggregation-select {
    width: 160px;
  }

  #bottom-widget__interval-select {
    width: 140px;
  }
`;

const StyledSection = styled(CenterFlexbox)`
  -webkit-box-align: center;
  -webkit-box-flex: 0;
  flex-grow: 0;
  color: ${props => props.theme.textColor};
  margin-right: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  opacity: 1;
`;

const SettingSectionWrapper = styled.div`
  display: flex;
`;

const StyledButtonWrapper = styled.div`
  margin-right: -40px;
`;

DataReportWidgetFactory.deps = [
  DatasetSelectorFactory,
  FieldSelectorFactory,
  DataReportChartFactory
];
function DataReportWidgetFactory(DatasetSelector, FieldSelector, DataReportChart) {
  class DataReportWidget extends Component {
    fieldSelector = props => props.fields;
    yAxisFieldsSelector = createSelector(this.fieldSelector, fields =>
      fields.filter(f => f.type === 'integer' || f.type === 'real')
    );

    _close = () => this.props.toggleDataReport();

    render() {
      const {
        datasets,
      } = this.props;

      return (
        <TimeBottomWidgetInner className="bottom-widget--inner">
          <TopSectionWrapper>
            <SettingSectionWrapper>
              <StyledSection>
                <PanelLabel>Dataset</PanelLabel>
                <div id="bottom-widget__field-select">
                  <DatasetSelector
                    datasets={datasets}
                    inputTheme="secondary"
                    placement="top"
                  />
                </div>
              </StyledSection>
              <StyledSection>
                <PanelLabel>Y Axis</PanelLabel>
                <div id="bottom-widget__field-select">
                  <FieldSelector
                    fields={this.yAxisFieldsSelector(Object.values(datasets)?.[0])}
                    placement="top"
                    value={null}
                    placeholder="placeholder.yAxis"
                    inputTheme="secondary"
                    erasable
                    showToken={true}
                  />
                </div>
              </StyledSection>
              <StyledSection>
                <PanelLabel>Aggregation</PanelLabel>
                <div id="bottom-widget__aggregation-select">
                  <ItemSelector
                    options={['Average', 'Sum', 'Min', 'Max']}
                    placement="top"
                    value={'Average'}
                    placeholder="placeholder.yAxis"
                    inputTheme="secondary"
                    erasable
                    showToken={true}
                  />
                </div>
              </StyledSection>
              <StyledSection>
                <PanelLabel>Interval</PanelLabel>
                <div id="bottom-widget__interval-select">
                  <ItemSelector
                    options={['10s', '1min', '5min']}
                    placement="top"
                    value={'10s'}
                    placeholder="placeholder.yAxis"
                    inputTheme="secondary"
                    erasable
                    showToken={true}
                  />
                </div>
              </StyledSection>
            </SettingSectionWrapper>
            <StyledSection>
              <StyledButtonWrapper>
                <Button link>
                  <Delete height="12px" onClick={this._close} />
                </Button>
              </StyledButtonWrapper>
            </StyledSection>
          </TopSectionWrapper>
          
          <DataReportChart 

          />
        </TimeBottomWidgetInner>
      );
    }
  }
  return DataReportWidget;
}

export default DataReportWidgetFactory;
