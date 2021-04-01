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
import { FormattedMessage } from 'react-intl';
import {REPORT_AGGREGATION_OPTIONS, REPORT_INTERVAL_OPTIONS} from 'constants/default-settings';

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
        dataId,
        field,
        aggregation,
        interval,
        chartData
      } = this.props;

      return (
        <TimeBottomWidgetInner className="bottom-widget--inner">
          <TopSectionWrapper>
            <SettingSectionWrapper>

              {Object.values(datasets).length > 1 ? (
                <StyledSection>
                  <PanelLabel>
                    <FormattedMessage id="dataReport.dataSource" />
                  </PanelLabel>
                  <div id="bottom-widget__field-select">
                    <DatasetSelector
                      datasets={datasets}
                      inputTheme="secondary"
                      placement="top"
                      onSelect={this.props.setReportDataSource}
                      dataId={dataId}
                    />
                  </div>
                </StyledSection>
              ) : null}

              <StyledSection>
                <PanelLabel>
                  <FormattedMessage id="dataReport.field" />
                </PanelLabel>
                <div id="bottom-widget__field-select">
                  <FieldSelector
                    fields={datasets[dataId] ? this.yAxisFieldsSelector(datasets[dataId]) : []}
                    placement="top"
                    value={field || ''}
                    placeholder="placeholder.yAxis"
                    inputTheme="secondary"
                    showToken={true}
                    erasable={false}
                    onSelect={this.props.setReportField}
                  />
                </div>
              </StyledSection>
              <StyledSection>
                <PanelLabel>
                  <FormattedMessage id="dataReport.aggregation" />
                </PanelLabel>
                <div id="bottom-widget__aggregation-select">
                  <ItemSelector
                    options={REPORT_AGGREGATION_OPTIONS}
                    selectedItems={REPORT_AGGREGATION_OPTIONS.find(op => op.value == aggregation)}
                    placement="top"
                    inputTheme="secondary"
                    displayOption={'label'}
                    filterOption={'label'}
                    getOptionValue={'value'}
                    multiSelect={false}
                    searchable={false}
                    onChange={this.props.setReportAggregation}
                  />
                </div>
              </StyledSection>
              <StyledSection>
                <PanelLabel>
                  <FormattedMessage id="dataReport.interval" />
                </PanelLabel>
                <div id="bottom-widget__interval-select">
                  <ItemSelector
                    options={REPORT_INTERVAL_OPTIONS}
                    selectedItems={REPORT_INTERVAL_OPTIONS.find(op => op.value == interval)}
                    placement="top"
                    inputTheme="secondary"
                    displayOption={'label'}
                    filterOption={'label'}
                    getOptionValue={'value'}
                    multiSelect={false}
                    searchable={false}
                    onChange={this.props.setReportInterval}
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
            dataset={datasets[dataId]}
            field={field}
            aggregation={aggregation}
            interval={interval}
            chartData={chartData}
          />
        </TimeBottomWidgetInner>
      );
    }
  }
  return DataReportWidget;
}

export default DataReportWidgetFactory;
