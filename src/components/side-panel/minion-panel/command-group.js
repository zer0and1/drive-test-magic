import React, { Component } from 'react';
import MinionGroupFactory from './minion-group';
import { Gear } from 'components/common/icons';

CommandGroupFactory.deps = [MinionGroupFactory];

function CommandGroupFactory(MinionGroup) {
  class CommandGroup extends Component {

    render() {
      return (
        <MinionGroup groupIcon={Gear} label="Command" toggled={true}>
          <table style={{ tableLayout: 'fixed', width: '100%' }}>
            <tbody>
              <tr>
                <td>Operation Mode:</td>
                <td colSpan="2"></td>
              </tr>
              <tr>
                <td>Sleep Intervel:</td>
                <td colSpan="2"></td>
              </tr>
              <tr>
                <td>Session ID:</td>
                <td colSpan="2"></td>
              </tr>
              <tr>
                <td>Command:</td>
                <td colSpan="2"></td>
              </tr>
              <tr>
                <td>Last ACK:</td>
                <td colSpan="2"></td>
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