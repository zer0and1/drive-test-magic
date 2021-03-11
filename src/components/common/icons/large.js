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

export default class Large extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string
  };

  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-large'
  };

  render() {
    return (
      <Base {...this.props}>
        <g>
          <path stroke="inherit" strokeWidth="5" fill="none" d="m50.61029,59.6936l-37.22059,0c-4.68715,0 -8.49363,-3.88186 -8.49363,-8.67841l0,-38.03039c0,-4.79655 3.79921,-8.67841 8.49363,-8.67841l37.22787,0c4.68715,0 8.48636,3.88187 8.48636,8.67841l0,38.03783c0,4.78913 -3.79921,8.671 -8.49363,8.671l-0.00001,-0.00002l0,-0.00001z" />
          <text fontWeight="bold" strokeWidth="0" strokeOpacity="null" fillOpacity="null" x="18.87382" y="46.92384" fontSize="43" fontFamily="inherit" textAnchor="start">L</text>
        </g>
      </Base >
    );
  }
}
