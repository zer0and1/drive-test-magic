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
import { ArrowDown, ArrowUp } from 'components/common/icons';
import LoadingDialog from 'components/modals/loading-dialog';

import {
  PanelHeaderContent,
  PanelHeaderTitle,
  PanelContent,
  StyledPanelHeader
} from 'components/common/styled-components';
import { FormattedMessage } from 'localization';
import PanelHeaderActionFactory from 'components/side-panel/panel-header-action';

const StyledMinionGroupHeader = styled.div`
  height: 48px;
  opacity: 1;
  position: relative;
  background-color: ${props => props.theme.panelBackgroundHover};
  font-family: ${props => props.theme.fontFamily};
  font-weight: ${props => props.theme.fontWeight};
  font-size: ${props => props.theme.fontSize};

  :hover {
  cursor: pointer;
  background-color: ${props => props.theme.panelBackgroundHover};
  }
`;

const StyledMinionGroupWrapper = styled(PanelContent)`
  padding: 5px;
  transition: opacity 0.5s ease-in, height 1.25s ease-out;
  margin-bottom: 5px;
  & * {
    font-familiy: ${props => props.theme.fontFamily};
  }
`;

const StyledMinionGroupContent = styled.div`
  background-color: ${props => props.theme.sidePanelBg}
  padding: 5px;
`;

MinionGroupFactory.deps = [PanelHeaderActionFactory];

function MinionGroupFactory(PanelHeaderAction) {
  class MinionGroup extends Component {
    static defaultProps = {
      toggled: true,
      disabled: false,
    };

    state = {
      toggled: this.props.toggled
    };

    toggle() {
      this.props.disabled || this.setState({ toggled: !this.state.toggled });
    }

    render() {
      let {toggled} = this.state;
      toggled = this.props.disabled ? false : toggled;

      return <div className="minion-panel__group" id={this.props.id}>
        <StyledMinionGroupHeader style={{ marginBottom: toggled ? '0px' : '5px' }}>
          <StyledPanelHeader onClick={this.toggle.bind(this)}>
            <PanelHeaderContent>
              <div className="minion-panel__header__icon icon">
                <this.props.groupIcon height="16px" />
              </div>
              <PanelHeaderTitle>
                <FormattedMessage id={this.props.label} />
              </PanelHeaderTitle>
            </PanelHeaderContent>
            <PanelHeaderAction
              id="minion-info-group"
              IconComponent={toggled ? ArrowUp : ArrowDown}
              onClick={this.toggle.bind(this)}
            />
          </StyledPanelHeader>
        </StyledMinionGroupHeader>
        {toggled ? (
          <StyledMinionGroupWrapper>
            <StyledMinionGroupContent>
              {this.props.children}
            </StyledMinionGroupContent>
          </StyledMinionGroupWrapper>
        ) : null}
      </div>
    }
  }

  return MinionGroup;
}

export default MinionGroupFactory;
