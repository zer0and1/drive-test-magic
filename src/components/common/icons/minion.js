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

export default class Minion extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string
  };

  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-layers'
  };

  render() {
    return (
      <Base {...this.props}>
        <path d="M 39.6 47.52 v -5.3222 h -5.3222 v 5.3222 h 5.3222 z M 30.3178 47.52 v -5.3222 h -5.1982 v 5.3222 h 5.1982 z M 21.1622 47.52 v -5.3222 h -5.3222 v 5.3222 h 5.3222 z M 50.1178 34.2778 q 2.1041 0 3.7118 1.6078 t 1.6078 3.7118 v 10.5178 q 0 2.1041 -1.6078 3.7118 t -3.7118 1.6078 h -36.8782 q -2.1041 0 -3.7118 -1.6078 t -1.6078 -3.7118 v -10.5178 q 0 -2.1041 1.6078 -3.7118 t 3.7118 -1.6078 h 26.3578 v -10.5178 h 5.3222 v 10.5178 h 5.1982 z M 50.9863 17.6959 l -2.1041 2.1041 q -2.5978 -2.5978 -6.6818 -2.5978 q -3.96 0 -6.5578 2.5978 l -2.1041 -2.1041 q 3.7118 -3.7118 8.6618 -3.7118 q 5.0741 0 8.7859 3.7118 z M 53.3359 15.5918 q -5.0741 -4.4563 -11.1382 -4.4563 q -5.94 0 -11.0141 4.4563 l -2.1041 -2.1041 q 5.5678 -5.5678 13.1182 -5.5678 q 7.6718 0 13.2422 5.5678 z"></path>
      </Base>
    );
  }
}
