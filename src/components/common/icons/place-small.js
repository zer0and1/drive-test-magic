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
import PropTypes from 'prop-types';
import Base from './base';
import styled from 'styled-components';
import { Tooltip } from 'components/common/styled-components';

const MODE_COLOR_MAP = {
  'idle': '#B31212',
  'report': 'green',
  'store': 'green',
  'no fix': 'darkgray',
  'offline': 'black'
};

const StyledBase = styled(Base)`
  .str0 {stroke:black;stroke-width:1;stroke-miterlimit:22.9256}
  .fil0 {fill:${props => MODE_COLOR_MAP[props.mode]}}
  .fil1 {fill:none}
`;

export default class PlaceMedium extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string,
    scale: PropTypes.number
  };

  static defaultProps = {
    height: '18px',
    width: '21px',
    predefinedClassName: 'data-ex-icons-place',
    viewBox: '0 0 21 18',
    scale: 1
  };

  render() {
    const { width, height, scale, name, mode } = this.props;
    const sw = parseInt(width) * scale;
    const sh = parseInt(height) * scale;

    return (
      <>
        <StyledBase {...{ ...this.props, width: `${sw}px`, height: `${sh}px`, viewBox: `0 0 ${sw} ${sh}` }} data-tip data-for={`minion-marker-small-${name}`}>
          <g transform={`scale(${scale})`}>
            <path d="m10.51775,16.91746c0.37096,-0.63917 0.7434,-1.28057 1.11306,-1.91732c2.72774,-4.70108 5.52099,-9.40589 8.25691,-14.10828c0.14611,-0.25146 0.43256,-0.61628 0.91799,-0.7555c-0.7421,0 -2.03123,0 -2.77315,0c-5.75216,0 -11.50358,0.00037 -17.25518,0c0.37077,0.63954 0.74154,1.27853 1.11287,1.9177c2.87589,4.95459 5.75142,9.90881 8.6275,14.86341l0,0l0,-0.00001z" className="fil0" />
            <path d="m0.80706,0.38579c2.75695,4.93766 6.95549,12.17029 9.53804,16.6201c3.0717,-5.29149 6.30363,-11.41826 9.52673,-16.59592l-19.06477,-0.02419l0,0.00001z" className="fil1 str0" />
          </g>
        </StyledBase >
        <Tooltip id={`minion-marker-small-${name}`} effect="solid">
          <span style={{fontWeight: '600'}}>{name}/{mode}</span>
        </Tooltip>
      </>
    );
  }
}
