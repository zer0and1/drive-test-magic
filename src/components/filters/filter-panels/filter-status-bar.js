import React from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import { rgbToHex } from 'utils/color-utils';
import { numToStr } from 'utils/data-utils';

const StyledStatusBar = styled.div`
  display: flex;
  margin-top: 5px;
  width: 100%;
  color: ${props => props.color ? props.color : '#999999'};
  font-family: ${props => props.theme.fontFamily};
  font-size: 12px;
  font-weight: bold;
`;

const StyledStatusItem = styled.div`
  float: left;
  width: 33.33%;
  font-weight: 500;
  font-size: 10px;
  text-align: ${props => props.align ? props.align : 'center'};
  ${props => props.align == 'left' ? 'margin-left: 6px;' : (props.align == 'right' ? 'margin-right: 6px;' : null)}
`;

FilterStatusBarFactory.deps = [];

function FilterStatusBarFactory() {
  const FilterStatusBar = React.memo(
    ({ datasets, filter }) => {
      const { dataId, filteredResultIndex, filterInputIndex } = filter;
      const dataset = datasets?.[dataId[0]];
      let selected = 0, totalPercent = 0, inputPercent = 0, color = 'red';

      if (dataset && filteredResultIndex && filterInputIndex) {
        selected = filteredResultIndex.length;
        totalPercent = _.round(selected * 100 / dataset.allData.length, 2);
        inputPercent = _.round(selected * 100 / filterInputIndex.length, 2);
        color = rgbToHex(dataset.color);
      }

      if (totalPercent > 10) {
        totalPercent = _.round(totalPercent, 1);
      }

      if (inputPercent > 10) {
        inputPercent = _.round(inputPercent, 1);
      }

      selected = numToStr(selected, 1);

      return (
        <StyledStatusBar>
          <StyledStatusItem align="left">
            {selected} selected
            </StyledStatusItem>
          <StyledStatusItem align="center">
            {inputPercent}% of input
          </StyledStatusItem>
          <StyledStatusItem align="right">
            {totalPercent}% of total
          </StyledStatusItem>
        </StyledStatusBar>
      );
    }
  );

  FilterStatusBar.displayName = 'FilterStatusBar';

  return FilterStatusBar;
}

export default FilterStatusBarFactory;
