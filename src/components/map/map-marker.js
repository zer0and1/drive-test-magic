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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Place } from 'components/common/icons';
import { injectIntl } from 'react-intl';
import styled from 'styled-components';

const MARKER_WIDTH = 56;
const MARKER_HEIGHT = 84;
const LABLE_MAX_WIDTH = 150;

const StyledMarker = styled(Place)`
  left: ${props => props.x  - MARKER_WIDTH / 2}px;
  top: ${props => props.y - MARKER_HEIGHT}px;
  position: absolute;
`;

const StyledLabel = styled.div`
  position: absolute;
  left: ${props => props.x  - LABLE_MAX_WIDTH / 2}px;
  top: ${props => props.y}px;
  width: ${LABLE_MAX_WIDTH}px;
  color: ${props => props.color};
  font-size: 15px;
  font-weight: bold;
  text-align: center;
  white-space: nowrap;
  user-select: none;
`;

MapMarkerFactory.deps = [];

export default function MapMarkerFactory() {
  class MapMarker extends PureComponent {
    static propTypes = {
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
      color: PropTypes.string,
      info: PropTypes.object,
    };

    static defaultProps = {
      color: 'yellow',
      info: {}
    }

    render() {
      const {color, x, y, info: {label}} = this.props;
      
      return (
        <div>
          <StyledMarker color={color} x={x} y={y} />
          {label && (
            <StyledLabel color={color} x={x} y={y}>
              {label}
            </StyledLabel>
          )}
        </div>
      );
    }
  }

  return injectIntl(MapMarker);
}
