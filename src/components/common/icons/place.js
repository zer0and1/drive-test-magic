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
  .str1 {stroke:black;stroke-width:3;stroke-miterlimit:22.9256}
  .str0 {stroke:black;stroke-width:1;stroke-miterlimit:22.9256}
  .fil3 {fill:none}
  .fil4 {fill:#FEFEFE}
  .fil0 {fill:#C5C6C6}
  .fil5 {fill:#5B5B5B}
  .fil1 {fill:black}
  .fil2 {fill:${props => MODE_COLOR_MAP[props.mode]}}
  .fnt1 {text-align: center; font-weight:500;font-size:323.55px;font-family:${props => props.theme.fontFamily};}
  .fnt0 {text-align: center; font-weight:bold;font-size:323.55px;font-family:${props => props.theme.fontFamily};}
`;

export default class Place extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string,
    scale: PropTypes.number
  };

  static defaultProps = {
    height: '80px',
    width: '180px',
    predefinedClassName: 'data-ex-icons-place',
    viewBox: '0 0 180 80',
    scale: 1
  };

  render() {
    const { width, height, scale, mode, name } = this.props;
    const sw = parseInt(width) * scale;
    const sh = parseInt(height) * scale;

    return (
      <StyledBase {...{ ...this.props, width: `${sw}px`, height: `${sh}px`, viewBox: `0 0 ${sw} ${sh}` }}>
        <g transform={`scale(${scale})`}>
          <path className="fil0" d="m168.13224,21.79451l0,9.23404c0,5.5007 -4.52444,10.0009 -10.05454,10.0009l-78.85729,0l-10.05454,0l0,-10.0009l0,-9.23404l10.05454,0l88.91183,0z" />
          <path className="fil1 str0" d="m168.31581,21.83027l0,-9.26821c0,-5.52135 -4.54113,-10.03825 -10.09189,-10.03825l-79.14973,0c-5.55076,0 -10.09189,4.51689 -10.09189,10.03825l0,9.26821l99.33351,0l-0.00001,0l0.00001,0z" />
          <path className="fil2" d="m90.28179,76.59125c0.79188,-1.36445 1.58696,-2.73366 2.37606,-4.09293c5.82293,-10.03547 11.78572,-20.07888 17.62613,-30.11712c0.31191,-0.53679 0.92341,-1.31557 1.95965,-1.61278c-1.58417,0 -4.3361,0 -5.91988,0c-12.27921,0 -24.55683,0.0008 -36.83485,0c0.79149,1.36524 1.58298,2.72929 2.37566,4.09373c6.1392,10.57664 12.27762,21.15247 18.41723,31.72911l0,-0.00001z" />
          <path className="fil3 str1" d="m111.07149,41.24163c0.42078,-0.28647 0.62779,-0.21297 1.80986,-0.21297l45.19634,0c5.53009,0 10.05454,-4.5002 10.05454,-10.0009l0,-18.46729c0,-5.5007 -4.52444,-10.0009 -10.05454,-10.0009l-78.85729,0c-5.53009,0 -10.05454,4.5002 -10.05454,10.0009l0,18.46729c0,0.83321 0,1.67238 0,2.51314c0,0.84116 0,1.6831 0,2.52227c0,0.83917 -0.04172,1.67675 0,2.50519c0.08264,1.65529 0.16966,1.96918 0.50859,2.9355c0.24873,0.68778 0.41482,1.08591 0.76407,1.71767c0,0 0.57613,0.99215 0.91029,1.56867c4.21094,7.25413 13.17361,22.69373 18.68662,32.1928c6.5572,-11.29581 13.11481,-22.59281 19.67121,-33.88862c0.39893,-0.68778 0.76327,-1.35014 1.36484,-1.85277c0,0.00001 -0.13803,0.00001 0,0.00002l0.00001,0z" />
          <line className="fil3 str1" x1="111.93411" y1="41.04296" x2="69.51314" y2="41.04296" />
          <g transform="matrix(0.039947564277541356,0,0,0.03973340124483171,761.7921221258214,419.99516665128823) ">
            <text className="fil4 fnt0" textAnchor="middle" y="-10155.19498" x="-16100.61602">{name}</text>
          </g>
          <g transform="matrix(0.039947564277541356,0,0,0.03973340124483171,802.4862770127534,437.65745817264093) ">
            <text className="fil5 fnt1" textAnchor="middle" y="-10145.76655" x="-17150.61602">{mode}</text>
          </g>
        </g>
      </StyledBase>
    );
  }
}
