import React, { Component } from 'react';
import MinionGroupFactory from './minion-group';
import { Gear, Spinner } from 'components/common/icons';
import styled from 'styled-components';
import { Button } from 'components/common/styled-components';
import JqxDropDownList from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxdropdownlist';
import PropTypes from 'prop-types';
import { MINION_COMMANDS, MQTT_BROKER_URL } from 'constants/default-settings';
import LoadingDialog from 'components/modals/loading-dialog';

import mqtt from 'mqtt';

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
    static state = {
      sleepInterval: null,
      sessionId: null,
      operationMode: null,
      lastAck: null,
      command: null,
      isCommandExecuting: null,
      isLoaded: false
    };
    static mqttClient = mqtt.connect(MQTT_BROKER_URL);
    static propTypes = {
      sleepInterval: PropTypes.number,
      sessionId: PropTypes.number,
      operationMode: PropTypes.string,
      lastAck: PropTypes.string,
      command: PropTypes.string,
      isCommandExecuting: PropTypes.bool,

      setSleepInterval: PropTypes.func.isRequired,
      setOperationMode: PropTypes.func.isRequired,
      increaseSessionId: PropTypes.func.isRequired,
      setCommand: PropTypes.func.isRequired,
      sendCommand: PropTypes.func.isRequired,
    };

    componentDidMount() {
      if (CommandGroup.state.isLoaded == false) {
        const client = CommandGroup.mqttClient;
        client.on('connect', () => {
          this.props.setMqttClient(CommandGroup.mqttClient);
        });
  
        client.on('message', (topic, message) => {
          this.props.setMqttMessage(topic, message);
          client.end();
        });
  
        client.on('error', err => console.log(err));

        CommandGroup.state.isLoaded = true;
      }
    }

    shouldComponentUpdate(nextProps) {
      const keys = Object.keys(CommandGroup.state)
      const changed = keys.reduce((acc, key) => acc || CommandGroup.state[key] != nextProps[key], false);
      CommandGroup.state = keys.reduce((acc, key) => ({ ...acc, [key]: nextProps[key] }), {});

      return changed;
    }

    render() {
      const {
        operationMode,
        sleepInterval,
        sessionId,
        lastAck,
        command,
        isCommandExecuting,
      } = this.props;

      return (
        <MinionGroup groupIcon={Gear} label="Command" toggled={true}>
          {isCommandExecuting && (
            <LoadingDialog size={32} height='120px' />
          )}
          {isCommandExecuting || (
            <table style={{ tableLayout: 'fixed', width: '100%' }}>
              <tbody>
                <tr>
                  <td>Operation Mode:</td>
                  <td colSpan="2">
                    <StyledMode
                      onClick={() => this.props.setOperationMode('idle')}
                      active={operationMode == 'idle'}
                    >
                      Idle
                  </StyledMode>
                    <StyledMode
                      onClick={() => this.props.setOperationMode('store')}
                      active={operationMode == 'store'}
                    >
                      Store
                  </StyledMode>
                    <StyledMode
                      onClick={() => this.props.setOperationMode('report')}
                      active={operationMode == 'report'}
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
                      active={sleepInterval == 0.5}
                    >
                      0.5s
                  </StyledInterval>
                    <StyledInterval
                      onClick={() => this.props.setSleepInterval(2)}
                      active={sleepInterval == 2}
                    >
                      2s
                  </StyledInterval>
                    <StyledInterval
                      onClick={() => this.props.setSleepInterval(10)}
                      active={sleepInterval == 10}
                    >
                      10s
                  </StyledInterval>
                    <StyledInterval
                      onClick={() => this.props.setSleepInterval(60)}
                      active={sleepInterval == 60}
                      last={true}
                    >
                      60s
                  </StyledInterval>
                  </td>
                </tr>
                <tr>
                  <td>Session ID:</td>
                  <td colSpan="2">
                    <StyledLabel>{sessionId}</StyledLabel>
                    <StyledButton onClick={this.props.increaseSessionId}>+1</StyledButton>
                  </td>
                </tr>
                <tr>
                  <td>Command:</td>
                  <td colSpan="2">
                    <JqxDropDownList
                      ref='commandSelector'
                      width={100}
                      height={20}
                      style={{ float: 'left', marginRight: '10px' }}
                      theme='metrodark'
                      source={MINION_COMMANDS}
                      selectedIndex={MINION_COMMANDS.findIndex(cmd => cmd == command)}
                      itemHeight={20}
                      autoDropDownHeight={true}
                      enableBrowserBoundsDetection={true}
                      onChange={({ args: { item: { value: cmd } } }) => this.props.setCommand(cmd)}
                    />
                    <StyledButton onClick={this.props.sendCommand}>SEND</StyledButton>
                  </td>
                </tr>
                <tr>
                  <td>Last ACK:</td>
                  <td colSpan="2">{lastAck}</td>
                </tr>
              </tbody>
            </table>
          )}
        </MinionGroup>
      );
    }
  }

  return CommandGroup;
}

export default CommandGroupFactory;