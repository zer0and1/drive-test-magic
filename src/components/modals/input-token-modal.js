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
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { injectIntl } from 'react-intl';
import { FormattedMessage } from 'localization';
import { media } from 'styles/media-breakpoints';
import { Button } from 'components/common/styled-components';
import LoadingDialog from './loading-dialog';

const StyledInput = styled.input`
  width: 100%;
`;

const StyledLabel = styled.div`
  font-size: 15px;
  font-family: ${props => props.theme.fontFamily};
  margin-bottom: 5px;
`;

const StyledModalFooter = styled.div`
  width: 100%;
  left: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-top: 24px;
  ${media.portable`
    padding-top: 24px;
  `};

  ${media.palm`
    padding-top: 16px;
  `};
  z-index: ${props => props.theme.modalFooterZ};
`;

const FooterActionWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const propTypes = {
  onInputToken: PropTypes.func.isRequired,
  isSendingToken: PropTypes.bool.isRequired
};

const InputTokenModalFactory = () => {
  class InputTokenModal extends Component {
    state = {
      userToken: ''
    }

    componentDidUpdate(prevProps) {
      if (prevProps.isSendingToken == true && this.props.isSendingToken == false) {
        this.props.onClose();
      }
    }

    _inputToken() {
      this.props.onInputToken(this.state.userToken);
    }

    render() {
      const { isSendingToken } = this.props;

      return (
        <div className="input-token-modal">
          {isSendingToken ? (
            <LoadingDialog size="64" height="150px" />
          ) : (
            <>
              <StyledLabel>Please enter user token</StyledLabel>
              <StyledInput type="text" onChange={e => this.setState({ userToken: e.target.value })} value={this.state.userToken} />

              <StyledModalFooter>
                <FooterActionWrapper>
                  <Button className="modal--footer--cancel-button" link onClick={this.props.onClose}>
                    <FormattedMessage id={'modal.button.defaultCancel'} />
                  </Button>
                  <Button className="modal--footer--confirm-button" onClick={() => this._inputToken()}>
                    <FormattedMessage id={'modal.button.send'} />
                  </Button>
                </FooterActionWrapper>
              </StyledModalFooter>
            </>
          )}
        </div>
      );
    }
  }
  InputTokenModal.propTypes = propTypes;
  return injectIntl(InputTokenModal);
};

export default InputTokenModalFactory;
