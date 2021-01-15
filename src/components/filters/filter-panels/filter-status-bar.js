import React from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import { rgbToHex } from 'utils/color-utils';
import { numToStr } from 'utils/data-utils';

const StyledStatusBar = styled.div`
  display: flex;
  margin-top: 5px;
  width: 100%;
  color: ${props => props.color ? props.color : 'red'};
  font-family: ${props => props.theme.fontFamily};
  font-size: 12px;
  font-weight: bold;
`;

const StyledStatusItem = styled.div`
  float: left;
  width: 50%;
  text-align: center;
`;

FilterStatusBarFactory.deps = [];

function FilterStatusBarFactory() {
  const FilterStatusBar = React.memo(
    ({ datasets, filter }) => {
      const { dataId, filteredResultIndex } = filter;
      const dataset = datasets?.[dataId[0]];
      let selected = 0, percent = 0, color = 'red';

      if (dataset && filteredResultIndex) {
        selected = filteredResultIndex.length;
        percent = Math.round(selected * 100 / dataset.allData.length);
        color = rgbToHex(dataset.color);
      }

      selected = numToStr(selected, 1);

      return (
        <StyledStatusBar color={color}>
          <StyledStatusItem>{selected} selected</StyledStatusItem>
          <StyledStatusItem>{percent}% of total</StyledStatusItem>
        </StyledStatusBar>
      );
    }
  );

  FilterStatusBar.displayName = 'FilterStatusBar';

  return FilterStatusBar;
}

export default FilterStatusBarFactory;
