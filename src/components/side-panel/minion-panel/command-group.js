import React, {Component} from 'react';
import MinionGroupFactory from './minion-group';
import { Gear } from 'components/common/icons';

CommandGroupFactory.deps = [MinionGroupFactory];

function CommandGroupFactory(MinionGroup) {
  class CommandGroup extends Component {

    render() {
      return (
        <MinionGroup groupIcon={Gear} label="Command" toggled={false}>
          <div style={{height: '150px'}}></div>
        </MinionGroup>
      );
    }
  }

  return CommandGroup;
}

export default CommandGroupFactory;