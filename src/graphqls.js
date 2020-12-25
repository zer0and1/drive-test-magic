import { gql } from '@apollo/client';

export const GQL_GET_MINIONS = (minionId = '#') => gql`
query MyQuery {
  signal_db_minions {
    id
    name
    lastupdate
    gps_fix_lastupdate
    gps_fix
    session_id
    operation_mode
    longitude
    latitude
    gps_sat
    gps_precision
    command
    command_id
    command_id_ack
    sleep_interval
    aux
  }
  signal_db_signal_samples(where:{minion_id: {_eq: "${minionId}"}, date: {}}, limit: 1) {
    id
    date
    minion_id
    mcc_mnc
    minion_dl_rate
    longitude
    latitude
    freq_mhz_ul
    freq_mhz_dl
    freq_band
    freq_arfcn
    enodeb_id
    duplex_mode
    dl_chan_bandwidth
    aux
    cell_id
    connection_state
    connection_type
    cqi
    minion_module_firmware
    minion_module_type
    minion_state
    minion_target_ping_ms
    minion_target_ping_sucess
    minion_ul_rate
    pcid
    rsrp_rscp
    rsrq
    rssi
    session_id
    sinr_ecio
    ul_chan_bandwidth
  }
}
`;

export const GQL_GET_SIGNAL_SAMPLES = gql`
query MyQuery {
  signal_db_signal_samples_view (limit: 1000) {
    aux
    bs_latitude
    bs_longitude
    cell_id
    cell_name
    connection_state
    connection_type
    cqi
    date
    dl_chan_bandwidth
    duplex_mode
    enodeb_id
    freq_arfcn
    freq_band
    freq_mhz_dl
    freq_mhz_ul
    latitude
    longitude
    mcc_mnc
    minion_dl_rate
    minion_id
    minion_module_firmware
    minion_module_type
    minion_state
    minion_target_ping_ms
    minion_ul_rate
    pcid
    rsrp_rscp
    rsrq
    rssi
    session_id
    sinr_ecio
    ul_chan_bandwidth
  }
}
`;

