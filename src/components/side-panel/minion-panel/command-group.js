import React from 'react';
import MinionGroupFactory from './minion-group';
import { Gear } from 'components/common/icons';

CommandGroupFactory.deps = [MinionGroupFactory];

function CommandGroupFactory(MinionGroup) {
  const CommandGroup = ({ data }) => (
    <MinionGroup groupIcon={Gear} label="Command" toggled={false}>
      <div style={{height: '150px'}}></div>
    </MinionGroup>
  );

  return CommandGroup;
}

export default CommandGroupFactory;