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

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Base from './base';

export default class Collapse extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string
  };

  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-collapse'
  };

  render() {
    return (
      <Base {...this.props}>
        <path d="m20.49419,13.74088l-8.74637,-8.74088l-6.74783,6.74783l8.74637,8.74637l-6.56115,6.55566l19.74384,0.01098l-0.03843,-19.70541l-6.39643,6.38545l0,0zm29.56635,6.74783l8.74637,-8.74088l-6.74234,-6.74783l-8.74637,8.74088l-6.39094,-6.39094l-0.03843,19.70541l19.74384,-0.01098l-6.56115,-6.55566l-0.01098,0zm-36.31417,23.1809l-8.74637,8.74088l6.74234,6.74234l8.74637,-8.73539l6.39643,6.39094l0.03843,-19.70541l-19.73835,0.01098l6.56115,6.55566l0,0zm42.87532,-6.55566l-19.74384,-0.01098l0.03843,19.70541l6.39094,-6.39094l8.74637,8.74088l6.74234,-6.74234l-8.74637,-8.74088l6.56115,-6.55566l0.01098,-0.00549z" />
      </Base>
    );
  }
}
