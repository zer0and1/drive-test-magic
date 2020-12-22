import React from 'react';
import MinionGroupFactory from './minion-group';
import { Minion } from 'components/common/icons';

SignalSampleGroupFactory.deps = [MinionGroupFactory];

function SignalSampleGroupFactory(MinionGroup) {
  const SignalSampleGroup = ({ data }) => (
    <MinionGroup groupIcon={Minion} label="Signal Sample">
      <table style={{tableLayout: 'fixed', width: '100%'}}>
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
            <td>{data.freq_mhz_dl}{data.freq_mhz_dl && ' MHz'}</td>
            <td>UL Freq:</td>
            <td>{data.freq_mhz_ul}{data.freq_mhz_ul && ' MHz'}</td>
          </tr>
          <tr>
            <td>DL Bandwidth:</td>
            <td>{data.dl_chan_bandwidth}</td>
            <td>UL Band:</td>
            <td>{data.ul_chan_bandwidth}</td>
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
            <td>{data.minion_target_ping_ms}{data.minion_target_ping_ms && ' ms'}</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td colSpan="4" style={{ height: '10px' }}></td>
          </tr>
          <tr>
            <td>RSRP:</td>
            <td>{data.rsrp_rscp}</td>
            <td>RSSI:</td>
            <td>{data.rssi}</td>
          </tr>
          <tr>
            <td>RSRQ:</td>
            <td>{data.rsrq}</td>
            <td>ECIO:</td>
            <td>{data.sinr_ecio}</td>
          </tr>
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