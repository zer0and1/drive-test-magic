import React, {Component} from 'react';
import MinionGroupFactory from './minion-group';
import {Gear} from 'components/common/icons';
import styled from 'styled-components';
import {Button, Input} from 'components/common/styled-components';
import JqxDropDownList from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxdropdownlist';
import PropTypes from 'prop-types';
import {MQTT_BROKER_URL, USER_ROLES} from 'constants/default-settings';

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

CommandGroupFactory.deps = [MinionGroupFactory];

function CommandGroupFactory(MinionGroup) {
  class CommandGroup extends Component {
    static observers = {
      sleepInterval: null,
      sessionId: null,
      operationMode: null,
      lastAck: null,
      command: null,
      selectedMinions: [],
      isCommandExecuting: null,
      commands: null,
      isLoaded: false
    };
    static mqttClient = mqtt.connect(MQTT_BROKER_URL);
    static propTypes = {
      sleepInterval: PropTypes.number,
      operationMode: PropTypes.string,
      command: PropTypes.string,
      isCommandExecuting: PropTypes.bool,
      userRole: PropTypes.string,

      setSleepInterval: PropTypes.func.isRequired,
      setOperationMode: PropTypes.func.isRequired,
      sendSessionCommand: PropTypes.func.isRequired,
      setSessionId: PropTypes.func.isRequired,
      setCommand: PropTypes.func.isRequired,
      sendCommand: PropTypes.func.isRequired,
      setMqttClient: PropTypes.func.isRequired,
      setMqttMessage: PropTypes.func.isRequired,
    };

    componentDidMount() {
      if (CommandGroup.observers.isLoaded == false) {
        const client = CommandGroup.mqttClient;
        client.on('connect', () => {
          this.props.setMqttClient(CommandGroup.mqttClient);
        });

        client.on('message', (topic, message) => {
          this.props.setMqttMessage(topic, message);
        });

        client.on('error', err => console.log(err));

        CommandGroup.observers.isLoaded = true;
      }
    }

    shouldComponentUpdate(nextProps) {
      const keys = Object.keys(CommandGroup.observers)
      const changed = keys.reduce((acc, key) => acc || CommandGroup.observers[key] != nextProps[key], false);
      CommandGroup.observers = keys.reduce((acc, key) => ({ ...acc, [key]: nextProps[key] }), {});

      return changed;
    }

    render() {
      const {
        operationMode,
        sleepInterval,
        lastAck,
        command,
        commands,
        sessionId,
        selectedMinions,
        userRole
      } = this.props;
      const hadPrivilege = userRole == USER_ROLES.ADMIN || userRole == USER_ROLES.USER;

      return (
        <MinionGroup groupIcon={Gear} label={`Command - ${selectedMinions.length} selected`} toggled={true}>
          <table style={{ tableLayout: 'fixed', width: '100%' }}>
            <tbody>
              <tr>
                <td>Operation Mode:</td>
                <td colSpan="2">
                  <StyledMode
                    onClick={() => hadPrivilege && this.props.setOperationMode('idle')}
                    active={operationMode == 'idle'}
                  >
                    Idle
                  </StyledMode>
                  <StyledMode
                    onClick={() => hadPrivilege && this.props.setOperationMode('store')}
                    active={operationMode == 'store'}
                  >
                    Store
                  </StyledMode>
                  <StyledMode
                    onClick={() => hadPrivilege && this.props.setOperationMode('report')}
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
                    onClick={() => hadPrivilege && this.props.setSleepInterval(0.5)}
                    active={sleepInterval == 0.5}
                  >
                    0.5s
                  </StyledInterval>
                  <StyledInterval
                    onClick={() => hadPrivilege && this.props.setSleepInterval(2)}
                    active={sleepInterval == 2}
                  >
                    2s
                  </StyledInterval>
                  <StyledInterval
                    onClick={() => hadPrivilege && this.props.setSleepInterval(10)}
                    active={sleepInterval == 10}
                  >
                    10s
                  </StyledInterval>
                  <StyledInterval
                    onClick={() => hadPrivilege && this.props.setSleepInterval(60)}
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
                  <Input
                    style={{
                      float: 'left',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      marginRight: '5px',
                      width: '50px',
                      textAlign: 'center',
                    }}
                    type="number"
                    value={sessionId || ''}
                    onChange={e => {
                      this.props.setSessionId(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.KeyCode === 13) {
                        this.props.sendSessionCommand(false);
                      }
                    }}
                  />
                  <StyledButton onClick={() => hadPrivilege && this.props.sendSessionCommand(true)}>+1</StyledButton>
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
                    source={commands}
                    selectedIndex={commands.findIndex(cmd => cmd == command)}
                    itemHeight={20}
                    autoDropDownHeight={true}
                    enableBrowserBoundsDetection={true}
                    onChange={({ args: { item } }) => item && this.props.setCommand(item.value)}
                  />
                  <StyledButton onClick={this.props.sendCommand}>SEND</StyledButton>
                </td>
              </tr>
              {selectedMinions.map(({ name }, idx) => (
                <tr key={idx}>
                  <td>{name}/ack:</td>
                  <td colSpan="2">{lastAck?.[name]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </MinionGroup>
      );
    }
  }

  return CommandGroup;
}

export default CommandGroupFactory;