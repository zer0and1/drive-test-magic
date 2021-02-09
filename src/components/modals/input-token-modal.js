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
import styled from 'styled-components';
import PropTypes from 'prop-types';

import {injectIntl} from 'react-intl';
import {FormattedMessage} from 'localization';

const StyledInput = styled.input`
  width: 100%;
`;

const StyledLabel = styled.div`
  font-size: 15px;
  font-family: ${props => props.theme.fontFamily};
  margin-bottom: 5px;
`;

const propTypes = {
  
};

const InputTokenModalFactory = () => {
  class InputTokenModal extends Component {
    componentDidMount() {
    }


    render() {

      return (
        <div className="input-token-modal">
          <StyledLabel>Please enter user token</StyledLabel>
          <StyledInput type="text" />
        </div>
      );
    }
  }
  InputTokenModal.propTypes = propTypes;
  return injectIntl(InputTokenModal);
};

export default InputTokenModalFactory;
