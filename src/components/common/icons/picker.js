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

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Base from './base';

export default class Picker extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string
  };

  static defaultProps = {
    height: '30px',
    predefinedClassName: 'data-ex-icons-picker',
    viewBox: '0 0 56 84'
  };

  render() {
    return (
      <Base {...this.props}>
        <path d="M 28.0238 0 c -15.4644 0 -28 12.5356 -28 28 c 0 4.9728 1.3356 9.625 3.6092 13.671 c 0.378 0.672 0.7742 1.3342 1.204 1.9712 l 23.1882 40.3578 l 23.1882 -40.3578 c 0.357 -0.5292 0.665 -1.0878 0.9842 -1.6408 l 0.2212 -0.329 c 2.2722 -4.046 3.6078 -8.6968 3.6078 -13.671 c 0 -15.4644 -12.537 -28 -28 -28 z m 0 14 c 7.7322 0 14 6.2678 14 14 c 0 7.7322 -6.2678 14 -14 14 c -7.7322 0 -14 -6.2678 -14 -14 c 0 -7.7322 6.2678 -14 14 -14 z"/>
      </Base>
    );
  }
}