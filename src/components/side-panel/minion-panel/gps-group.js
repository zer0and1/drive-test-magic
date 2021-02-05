import React from 'react';
import MinionGroupFactory from './minion-group';
import moment from 'moment';

import { CursorClick } from 'components/common/icons';

GPSGroupFactory.deps = [MinionGroupFactory];

function GPSGroupFactory(MinionGroup) {
  const round = (v, n) => Math.round(v * Math.pow(10, n)) / Math.pow(10, n);

  const GPSGroup = ({ data, disabled }) => (
    <MinionGroup groupIcon={CursorClick} label="GPS" disabled={disabled} >
      <table style={{tableLayout: 'fixed', width: '100%'}}>
        <tbody>
          <tr>
            <td>Latitude:</td>
            <td>{data.latitude && round(data.latitude, 6)}</td>
            <td>Longitude:</td>
            <td>{data.longitude && round(data.longitude, 6)}</td>
          </tr>
          <tr>
            <td>Satelites:</td>
            <td>{data.gps_sat}</td>
            <td>Precision:</td>
            <td>{data.gps_precision}{data.gps_precision && 'm'}</td>
          </tr>
          <tr>
            <td>Last Fix:</td>
            <td>{data.lastupdate && moment(data.lastupdate).format("MM-DD-YYYY")}</td>
            <td>h:</td>
            <td>{data.lastupdate && moment(data.lastupdate).format("HH:mm:ss")}</td>
          </tr>
        </tbody>
      </table>
    </MinionGroup>
  );

  return GPSGroup;
}

export default GPSGroupFactory;