import React, { Component } from 'react';
import MinionGroupFactory from './minion-group';
import { Gear } from 'components/common/icons';
import styled from 'styled-components';
import { Button } from 'components/common/styled-components';
import JqxDropDownList from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxdropdownlist';
import PropTypes from 'prop-types';

const StyledButton = styled(Button)`
  background-color: ${props => props.active ? props.theme.activeColor : props.theme.panelBackground};
  padding: 3px 5px;
  float: left;
  :hover {
    background-color: ${props => props.theme.activeColorHover};
  }
  :active {
    background-color: ${props => props.theme.activeColor};
  }
`;

const StyledMode = styled(StyledButton)`
  width: 30%;
  margin-right: ${props => props.last ? 0 : 5}%;
`;

const StyledInterval = styled(StyledButton)`
  width: 21.25%;
  margin-right: ${props => props.last ? 0 : 5}%;
`;

const StyledLabel = styled.div`
  float: left;
  height: 20px;
  display: flex;
  align-items: center;
  margin-right: 5px;
`;

CommandGroupFactory.deps = [MinionGroupFactory];

function CommandGroupFactory(MinionGroup) {
  class CommandGroup extends Component {
    static propTypes = {
      sleepInterval: PropTypes.number,
      sessionId: PropTypes.number,
      operationMode: PropTypes.string,
      lastAck: PropTypes.string,

      setSleepInterval: PropTypes.func.isRequired,
      setOperationMode: PropTypes.func.isRequired,
      increaseSessionId: PropTypes.func.isRequired,
      sendCommand: PropTypes.func.isRequired
    };

    render() {
      return (
        <MinionGroup groupIcon={Gear} label="Command" toggled={true}>
          <table style={{ tableLayout: 'fixed', width: '100%' }}>
            <tbody>
              <tr>
                <td>Operation Mode:</td>
                <td colSpan="2">
                  <StyledMode
                    onClick={() => this.props.setOperationMode('idle')}
                    active={this.props.operationMode == 'idle'}
                  >
                    Idle
                  </StyledMode>
                  <StyledMode
                    onClick={() => this.props.setOperationMode('store')} 
                    active={this.props.operationMode == 'store'}
                  >
                    Store
                  </StyledMode>
                  <StyledMode
                    onClick={() => this.props.setOperationMode('report')} 
                    active={this.props.operationMode == 'report'}
                    last={true}
                  >
                    Report
                  </StyledMode>
                </td>
              </tr>
              <tr>
                <td>Sleep Interval:</td>
                <td colSpan="2">
                  <StyledInterval
                    onClick={() => this.props.setSleepInterval(0.5)}
                    active={this.props.sleepInterval == 0.5}
                  >
                    0.5s
                  </StyledInterval>
                  <StyledInterval
                    onClick={() => this.props.setSleepInterval(2)}
                    active={this.props.sleepInterval == 2}
                  >
                    2s
                  </StyledInterval>
                  <StyledInterval 
                    onClick={() => this.props.setSleepInterval(10)}
                    active={this.props.sleepInterval == 10}
                  >
                    10s
                  </StyledInterval>
                  <StyledInterval 
                    onClick={() => this.props.setSleepInterval(60)}
                    active={this.props.sleepInterval == 60}
                    last={true}
                  >
                    60s
                    </StyledInterval>
                </td>
              </tr>
              <tr>
                <td>Session ID:</td>
                <td colSpan="2">
                  <StyledLabel>{this.props.sessionId}</StyledLabel>
                  <StyledButton onClick={this.props.increaseSessionId}>+1</StyledButton>
                </td>
              </tr>
              <tr>
                <td>Command:</td>
                <td colSpan="2">
                  <JqxDropDownList 
                    width={100} 
                    height={20}
                    style={{ float: 'left', marginRight: '10px' }}
                    theme='metrodark'
                    source={['Command1', 'Command2', 'Command2', 'Command2', 'Command2', 'Command3']} 
                    selectedIndex={1} 
                    itemHeight={20}
                    autoDropDownHeight={true}
                    enableBrowserBoundsDetection={true}
                  />
                  <StyledButton onClick={this.props.sendCommand}>SEND</StyledButton>
                </td>
              </tr>
              <tr>
                <td>Last ACK:</td>
                <td colSpan="2">dt-minion-1/ack</td>
              </tr>
            </tbody>
          </table>
        </MinionGroup>
      );
    }
  }

  return CommandGroup;
}

export default CommandGroupFactory;