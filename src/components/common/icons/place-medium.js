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
import styled from 'styled-components';

const MODE_COLOR_MAP = {
  'idle': '#B31212',
  'report': 'green',
  'store': 'green',
  'no fix': 'darkgray',
  'offline': 'black'
};

const StyledBase = styled(Base)`
  .str0 {stroke:black;stroke-width:3;stroke-miterlimit:22.9256}
  .fil1 {fill:none}
  .fil2 {fill:white}
  .fil3 {fill:black}
  .fil0 {fill:${props => MODE_COLOR_MAP[props.mode]}}
  .fnt0 {text-align: center; font-weight:bold;font-size:323.55px;font-family:${props => props.theme.fontFamily};}
`;

export default class PlaceMedium extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string,
    scale: PropTypes.number
  };

  static defaultProps = {
    height: '61px',
    width: '100px',
    predefinedClassName: 'data-ex-icons-place',
    viewBox: '0 0 100 61',
    scale: 1
  };

  render() {
    const { width, height, scale, name } = this.props;
    const sw = parseInt(width) * scale;
    const sh = parseInt(height) * scale;

    return (
      <StyledBase {...{ ...this.props, width: `${sw}px`, height: `${sh}px`, viewBox: `0 0 ${sw} ${sh}` }}>
        <g transform={`scale(${scale})`}>
          <path d="m22.36385,57.41236c0.77013,-1.32696 1.54335,-2.65855 2.31078,-3.98048c5.66295,-9.75974 11.46191,-19.52721 17.14186,-29.28966c0.30334,-0.52205 0.89803,-1.27943 1.90581,-1.56847c-1.54065,0 -4.21697,0 -5.75723,0c-11.94184,0 -23.88214,0.00077 -35.82282,0c0.76974,1.32773 1.53949,2.6543 2.31039,3.98126c5.97053,10.28604 11.9403,20.57131 17.91122,30.85736l-0.00001,-0.00001z" className="fil0" />
          <path d="m42.46351,23.22643c0.40922,-0.27861 0.61054,-0.20712 1.76013,-0.20712l43.95459,0c5.37816,0 9.77829,-4.37656 9.77829,-9.72612l0,-1.80882c0,-5.34956 -4.40284,-9.72612 -9.77829,-9.72612l-76.6907,0c-5.37545,0 -9.77829,4.37927 -9.77829,9.72612l0,1.80882c0,0.81032 0,1.62643 0,2.44409c0,0.81805 0,1.63686 0,2.45298c0,0.81611 -0.04057,1.63068 0,2.43636c0.08037,1.60981 0.165,1.91508 0.49461,2.85485c0.2419,0.66889 0.40342,1.05608 0.74308,1.67048c0,0 0.56031,0.96488 0.88528,1.52558c4.09525,7.05482 12.81167,22.07023 18.17321,31.30831c6.37705,-10.98546 12.75448,-21.97208 19.13075,-32.95753c0.38796,-0.66889 0.74231,-1.31305 1.32734,-1.80186l0,-0.00002z" className="fil1 str0" />
          <line y2="22.84076" x2="2.16581" y1="22.84076" x1="49.95173" className="fil1 str0" />
          <path d="m42.07075,23.33537l45.71472,-0.20712c5.37816,0 9.77829,-4.37656 9.77829,-9.72612l0,-1.80882c0,-5.34956 -4.40284,-9.72612 -9.77829,-9.72612l-76.6907,0c-5.37545,0 -9.77829,4.37927 -9.77829,9.72612l0,1.80882c0,0.81032 0,1.62643 0,2.44409c0,0.81805 0,1.63686 0,2.45298c0,0.81611 -0.03941,1.633 0,2.43636c0.07806,1.60866 0.165,1.17973 0.49461,2.1195l40.25966,0.48032l0,-0.00001z" className="fil3" />
          <g transform="matrix(0.03885001260752199,0,0,0.03864173366307799,-106.05148119666657,-151.16146750533713) ">
            <text x="4007.12373" y="4340.22056" textAnchor="middle" className="fil2 fnt0">{name}</text>
          </g>
        </g>
      </StyledBase >
    );
  }
}
