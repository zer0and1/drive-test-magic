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

const MARKER_WIDTH = 160;
const MARKER_HEIGHT = 80;

const StyledMarker = styled(Place)`
  left: ${props => props.x - MARKER_WIDTH * props.scale / 2}px;
  top: ${props => props.y - MARKER_HEIGHT * props.scale}px;
  position: absolute;
`;

const StyledMarkerWrapper = styled.div`
  pointer-events: none;
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
      const { mapW, x, y, info: { mode, name } } = this.props;
      const scale = mapW / 1920;

      return (
        <StyledMarkerWrapper>
          <StyledMarker x={x} y={y} scale={scale} mode={mode} name={name}/>
        </StyledMarkerWrapper>
      );
    }
  }

  return injectIntl(MapMarker);
}
