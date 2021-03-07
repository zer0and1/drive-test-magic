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

import React, { useCallback } from 'react';
import styled from 'styled-components';
import _ from 'lodash';

import RangeFilterFactory from 'components/filters/range-filter';
import FieldPanelWithFieldSelectFactory from 'components/filters/filter-panels/filter-panel-with-field-select';
import FilterStatusBarFactory from './filter-status-bar';
import { rgbToHex } from 'utils/color-utils';
import { numToStr } from 'utils/data-utils';

const StyledAggrBar = styled.div`
  display: flex;
  width: 100%;
  color: ${props => props.color ? props.color : '#999999'};
  font-family: ${props => props.fontFamily};
  font-size: 12px;
  font-weight: bold;
`;

const StyledAggrItem = styled.div`
  float: left;
  width: 33.33%;
  font-weight: 500;
  font-size: 10px;
  text-align: ${props => props.align ? props.align : 'center'};
  ${props => props.align == 'left' ? 'margin-left: 6px;' : (props.align == 'right' ? 'margin-right: 6px;' : null)}
`

RangeFilterPanelFactory.deps = [FieldPanelWithFieldSelectFactory, RangeFilterFactory, FilterStatusBarFactory];

function RangeFilterPanelFactory(FieldPanelWithFieldSelect, RangeFilter, FilterStatusBar) {
  const RangeFilterPanel = React.memo(
    ({
      idx,
      datasets,
      allAvailableFields,
      filter,
      isAnyFilterAnimating,
      enlargeFilter,
      removeFilter,
      moveUpFilter,
      moveDownFilter,
      setFilter,
      toggleAnimation
    }) => {
      const onSetFilter = useCallback(value => setFilter(idx, 'value', value), [idx, setFilter]);
      const { dataId, fieldIdx, filterInputIndex } = filter;
      const dataset = datasets?.[dataId[0]];
      let min = 0, max = 0, avg = 0, color = 'red';

      if (dataset && filterInputIndex) {
        const { allData, color: rgb } = dataset;
        const fieldData = filterInputIndex.map(idx => allData[idx]).filter(d => d).map(d => d[fieldIdx[0]]);
        min = numToStr(_.min(fieldData), 1);
        max = numToStr(_.max(fieldData), 1);
        avg = numToStr(_.mean(fieldData), 1);
        color = rgbToHex(rgb);
      }

      return (
        <div className="range-filter-panel">
          <FieldPanelWithFieldSelect
            allAvailableFields={allAvailableFields}
            datasets={datasets}
            filter={filter}
            idx={idx}
            removeFilter={removeFilter}
            moveUpFilter={moveUpFilter}
            moveDownFilter={moveDownFilter}
            setFilter={setFilter}
          >
            {filter.type && !filter.enlarged && (
              <div className="filter-panel__filter">
                <StyledAggrBar>
                  <StyledAggrItem align="left">min: {min}</StyledAggrItem>
                  <StyledAggrItem align="center">avg: {avg}</StyledAggrItem>
                  <StyledAggrItem align="right">max: {max}</StyledAggrItem>
                </StyledAggrBar>
                <RangeFilter
                  filter={filter}
                  idx={idx}
                  isAnyFilterAnimating={isAnyFilterAnimating}
                  toggleAnimation={toggleAnimation}
                  setFilter={onSetFilter}
                />
                <FilterStatusBar datasets={datasets} filter={filter} />
              </div>
            )}
          </FieldPanelWithFieldSelect>
        </div>
      );
    }
  );

  RangeFilterPanel.displayName = 'RangeFilterPanel';

  return RangeFilterPanel;
}

export default RangeFilterPanelFactory;
