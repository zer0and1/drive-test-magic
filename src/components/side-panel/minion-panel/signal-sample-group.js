import React from 'react';
import MinionGroupFactory from './minion-group';
import { Minion } from 'components/common/icons';
import { timeDifference } from 'utils/utils';
import styled from 'styled-components';
import moment from 'moment-timezone';

const StyledProgBarWrapper = styled.div`
  display: block;
  float: left;
  background-color: ${props => props.theme.panelBackgroundHover};
  height: 15px;
  width: 50px;
  margin-top: 1px;
`;

const COLOR_LEVEL_MAP = ['#22c521', '#cfd02e', '#de7a20', '#a82f31'];

const StyledProgBar = styled.span`
  display: block;
  height: 100%;
  overflow: hidden;
  width: ${props => props.prog > 100 ? 100 : props.prog}%;
  background-color: ${props => COLOR_LEVEL_MAP[props.level]}
`;

const StyledLeftDiv = styled.div`
  padding-left: 4px;
  float: left;
`;

const ProgressBar = ({ value, prog, level }) => (
  <>
    <StyledProgBarWrapper>
      <StyledProgBar prog={prog} level={level} />
    </StyledProgBarWrapper>
    <StyledLeftDiv>{value}</StyledLeftDiv>
  </>
);

SignalSampleGroupFactory.deps = [MinionGroupFactory];

function SignalSampleGroupFactory(MinionGroup) {

  const makeTimeLabel = (value) => {
    if (!value) {
      return '';
    }

    const date = moment(value).format('YYYY-MM-DD HH:mm:ss');
    const now = moment.tz(new Date(), 'Europe/Paris').format('YYYY-MM-DD HH:mm:ss');
    const diff = moment(now).diff(moment(date), 'seconds');

    if (diff > 10) {
      return ' - ' + timeDifference(diff);
    }
    else {
      return ' - Just Now';
    }
  };

  const SignalSampleGroup = ({ data, disabled }) => (
    <MinionGroup groupIcon={Minion} label={`Signal Sample${disabled ? '' : makeTimeLabel(data.date)}`} disabled={disabled}>
      <table style={{ tableLayout: 'fixed', width: '100%' }}>
        <tbody>
          <tr>
            <td>Con State:</td>
            <td>{data.connection_state}</td>
            <td>Con Type:</td>
            <td>{data.connection_type}</td>
          </tr>
          <tr>
            <td>MCC-MNC:</td>
            <td>{data.mcc_mnc}</td>
            <td>Cell Id:</td>
            <td>{data.cell_id}</td>
          </tr>
          <tr>
            <td>PCID:</td>
            <td>{data.pcid}</td>
            <td>eNode-b:</td>
            <td>{data.enodeb_id}</td>
          </tr>
          <tr>
            <td>Band:</td>
            <td>{data.freq_band}</td>
            <td>Duplex:</td>
            <td>{data.duplex_mode}</td>
          </tr>
          <tr>
            <td>DL Freq:</td>
            <td>{data.freq_mhz_dl}{data.freq_mhz_dl != undefined && ' MHz'}</td>
            <td>UL Freq:</td>
            <td>{data.freq_mhz_ul}{data.freq_mhz_ul != undefined && ' MHz'}</td>
          </tr>
          <tr>
            <td>DL Channel:</td>
            <td>{data.dl_chan_bandwidth}{data.dl_chan_bandwidth != undefined && ' MHz'}</td>
            <td>UL Channel:</td>
            <td>{data.ul_chan_bandwidth}{data.ul_chan_bandwidth != undefined && ' MHz'}</td>
          </tr>
          <tr>
            <td colSpan="4" style={{ height: '10px' }}></td>
          </tr>
          <tr>
            <td>DL Rate:</td>
            <td>{data.minion_dl_rate}</td>
            <td>UL Rate:</td>
            <td>{data.minion_ul_rate}</td>
          </tr>
          <tr>
            <td>Target Ping:</td>
            <td>{data.minion_target_ping_ms}{data.minion_target_ping_ms != undefined && ' ms'}</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td colSpan="4" style={{ height: '10px' }}></td>
          </tr>
          <tr>
            <td>RSRP:</td>
            <td>{data.rsrp_rscp != undefined && <ProgressBar value={data.rsrp_rscp} prog={data.rsrp_rscp_prog} level={data.rsrp_rscp_level} />}</td>
            <td>RSSI:</td>
            <td>{data.rssi != undefined && <ProgressBar value={data.rssi} prog={data.rssi_prog} level={data.rssi_level} />}</td>
          </tr>
          <tr>
            <td>RSRQ:</td>
            <td>{data.rsrq != undefined && <ProgressBar value={data.rsrq} prog={data.rsrq_prog} level={data.rsrq_level} />}</td>
            <td>{data.connection_type == 'LTE' ? 'SINR' : 'ECIO'}:</td>
            <td>{data.sinr_ecio != undefined && <ProgressBar value={data.sinr_ecio} prog={data.sinr_ecio_prog} level={data.sinr_ecio_level} />}</td>
          </tr>
          {data.connection_type == 'LTE' != undefined && (
            <tr>
              <td>CQI:</td>
              <td>{data.cqi != undefined && <ProgressBar value={data.cqi} prog={data.cqi_prog} level={data.cqi_level} />}</td>
              <td colSpan="2"></td>
            </tr>
          )}
          <tr>
            <td colSpan="4" style={{ height: '10px' }}></td>
          </tr>
          <tr>
            <td colSpan="2">Module Type: </td>
            <td colSpan="2">{data.minion_module_type}</td>
          </tr>
          <tr>
            <td colSpan="2">Firmware:</td>
            <td colSpan="2">{data.minion_module_firmware}</td>
          </tr>
        </tbody>
      </table>
    </MinionGroup>
  );

  return SignalSampleGroup;
}

export default SignalSampleGroupFactory;