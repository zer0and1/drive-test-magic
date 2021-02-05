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

export default class Select extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string
  };

  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-select'
  };

  render() {
    return (
      <Base {...this.props}>
        <path d="m52.02465,45.56986l-27.85637,0c-3.50792,0 -6.35674,-2.84338 -6.35674,-6.35674l0,-27.85637c0,-3.51337 2.84338,-6.35674 6.35674,-6.35674l27.86182,0c3.50792,0 6.3513,2.84338 6.3513,6.35674l0,27.86182c0,3.50792 -2.84338,6.3513 -6.35674,6.3513zm2.08623,-32.48639c0,-2.10802 -1.70494,-3.81296 -3.81296,-3.81296l-24.40293,0c-2.10802,0 -3.81296,1.70494 -3.81296,3.81296l0,24.40293c0,2.10802 1.70494,3.81296 3.81296,3.81296l24.40293,0c2.10802,0 3.81296,-1.70494 3.81296,-3.81296l0,-24.40293zm-17.71936,20.12697c-0.25601,0.25601 -0.58284,0.3813 -0.91511,0.42487c-0.61007,0.33772 -1.38356,0.27235 -1.89558,-0.24512l-6.79796,-6.78706c-0.62641,-0.62641 -0.62641,-1.63957 0,-2.26599l0.75714,-0.75714c0.62641,-0.62641 1.63957,-0.62641 2.26599,0l5.08757,5.08757l11.31359,-11.31359c0.62641,-0.62641 1.63957,-0.62641 2.26599,0l0.75714,0.75714c0.62641,0.62641 0.62641,1.63957 0,2.26599l-12.83877,12.83332zm11.31359,14.49468c1.17657,0 2.13526,0.95869 2.13526,2.13526c0,1.17657 -0.95324,2.13526 -2.13526,2.13526l-30.96121,0c-2.94687,0 -5.33814,-2.39127 -5.33814,-5.33814l0,-30.96121c0,-1.18202 0.95324,-2.13526 2.13526,-2.13526c1.17657,0 2.13526,0.95324 2.13526,2.13526l0,28.82596c0,1.7703 1.43258,3.20288 3.20288,3.20288l28.82596,0zm-8.54102,6.40577c1.17657,0 2.13526,0.95869 2.13526,2.13526c0,1.17657 -0.95869,2.13526 -2.13526,2.13526l-28.82596,0c-2.94687,0 -5.33814,-2.39127 -5.33814,-5.33814l0,-28.82596c0,-1.17657 0.95869,-2.13526 2.13526,-2.13526c1.18202,0 2.13526,0.95324 2.13526,2.13526l0,26.6907c0,1.7703 1.43258,3.20288 3.20288,3.20288l26.6907,0z" />
      </Base>
    );
  }
}
