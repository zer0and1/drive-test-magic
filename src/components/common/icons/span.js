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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Base from './base';

export default class Span extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string
  };

  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-span',
  };

  render() {
    return (
      <Base {...this.props} viewBox='0 0 155 64' width="50px">
        <path d="m130.78201,19.88232c-9.32173,-9.0616 -10.10012,-9.76316 -10.84076,-9.85413c-0.45423,-0.03909 -0.5324,0.01348 -0.73997,0.50679c-0.13007,0.28507 -0.22037,2.63572 -0.22105,5.17979l0.00067,4.67367l-14.67001,0c-8.07497,0 -14.74818,0.07818 -14.83916,0.16916c-0.44142,0.44142 -0.50612,1.98606 -0.48051,12.21624c0.0128,10.45056 0.11726,11.853 0.73997,11.87861c0.10378,0 6.86797,0.0128 15.03393,0l14.86477,0.01281l0.00067,5.16699c0.0128,3.62235 0.09098,5.20607 0.29855,5.33547c0.70088,0.49331 0.62271,0.57149 20.60324,-20.03175l2.07704,-2.15521l-0.0128,-0.71369c0.0128,-0.71369 -0.01348,-0.73997 -1.76568,-2.51913c-0.96034,-0.98595 -5.49182,-5.41229 -10.0489,-9.86559l0,0z" />
        <path d="m50.69341,20.38843l-14.67135,0l0,-4.67435c0,-2.54474 -0.09098,-4.89472 -0.22105,-5.17979c-0.35044,-0.86936 -0.96102,-0.70088 -2.51913,0.67527c-2.38907,2.12893 -20.56483,19.91517 -20.74679,20.30469c-0.09098,0.22037 -0.15568,0.64899 -0.14287,0.94754c0.02628,0.5196 0.32483,0.84375 10.59343,11.42505c11.10022,11.41158 11.43786,11.7236 12.08752,11.28151c0.20757,-0.12939 0.28507,-1.71379 0.29855,-5.33547l0,-5.16766l15.03393,0c14.30676,0.00067 15.03393,-0.02561 15.30619,-0.45423c0.19476,-0.32416 0.28574,-3.9209 0.29855,-11.43719c0.02561,-10.23019 -0.03841,-11.7755 -0.47984,-12.21692c-0.08963,-0.09098 -6.76217,-0.16848 -14.83714,-0.16848l0,0z" />
      </Base>
    );
  }
}
