import { gql } from '@apollo/client';

export const GQL_GET_MINIONS = (minionId = '#') => gql`
query MyQuery {
  signal_db_minions {
    id
    name
    type
    antenna_type
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
  signal_db_signal_samples(where:{minion_id: {_eq: "${minionId}"}}, order_by: {date: desc }, limit: 1) {
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
    sinr_ecio
    ul_chan_bandwidth
    mcs
    ri
    pmi
  }
}
`;

export const GQL_GET_STATIC_DATA = () => gql`
query MyQuery {
  signal_db_minion_commands {
    id, command
  }
  signal_db_antennas {
    id, antenna_type
  }
}
`;

export const GQL_GET_PROFILES = () => gql`
query {
  signal_db_profiles {
    id
    label
    config
  }
}
`;

export const GQL_INSERT_PROFILE = () => gql`
mutation($label: String!, $config: jsonb) {
  insert_signal_db_profiles_one(
    object: {
      label: $label,
      config: $config
    }
  ) {
    id
    label
    config
  }
}
`;

export const GQL_UPDATE_PROFILE = () => gql`
mutation($id: uuid!, $config: jsonb) {
  update_signal_db_profiles_by_pk (
    pk_columns: {id: $id}
    _set: {config: $config}
  ) {
    id
    label
    config
  }
}
`;

export const GQL_DELETE_PROFILE = () => gql`
mutation($id: uuid!) {
  delete_signal_db_profiles_by_pk (
    id: $id
  ) {
    id
  }
}
`;

export const GQL_UPDATE_PROFILE_LABEL = () => gql`
mutation($id: uuid!, $label: String!) {
  update_signal_db_profiles_by_pk (
    pk_columns: {
      id: $id
    },
    _set: {
      label: $label
    }
  ) {
    id
    label
  }
}
`;

export const GQL_INSERT_DATASET = () => gql`
mutation($id: String!, $label: String, $type: String, $query: String, $sessions: jsonb, $enabled: Boolean) {
  insert_signal_db_datasets_one(
    object: {
      id: $id,
      label: $label,
      query: $query,
      type: $type,
      sessions: $sessions,
      enabled: $enabled
    }
  ) {
    id
    label
    query
    type
    sessions
    enabled
  }
}
`;

export const GQL_GET_DATASETS = () => gql`
query {
  signal_db_datasets {
    id
    label
    query
    type
    sessions
    enabled
  }
}
`;

export const GQL_UPDATE_DATASET = () => gql`
mutation($id: String!, $label: String, $type: String, $query: String, $sessions: jsonb, $enabled: Boolean) {
  update_signal_db_datasets_by_pk(
    pk_columns: {
      id: $id
    },
    _set: {
      label: $label,
      query: $query,
      type: $type,
      sessions: $sessions,
      enabled: $enabled
    }
  ) {
    id
    label
    query
    type
    sessions
    enabled
  }
}
`;

export const GQL_DELETE_DATASET = () => gql`
mutation($id: String!) {
  delete_signal_db_datasets_by_pk (
    id: $id
  ) {
    id
  }
}
`;

export const GQL_DELETE_SIGNAL_SAMPLES = (datesToDelete) => gql`
mutation {
  delete_signal_db_signal_samples (
    where: { date: { _in: [${datesToDelete.toString()}] } }
  ) {
    affected_rows
  }
}
`;


export const GQL_INSERT_MINION = () => gql`
mutation($name: String!, $longitude: numeric, $latitude: numeric, $minion_type: String, $antenna_type: String) {
  insert_signal_db_minions_one(
    object: {
      name: $name,
      longitude: $longitude,
      latitude: $latitude,
      type: $minion_type,
      antenna_type: $antenna_type
      operation_mode: "idle",
      session_id: 0,
      sleep_interval: 2
    }
  ) {
    id
    name
    type
    antenna_type
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
}
`;

export const GQL_UPDATE_MINION = () => gql`
mutation($id: Int!, $name: String!, $longitude: numeric, $latitude: numeric, $minion_type: String, $antenna_type: String) {
  update_signal_db_minions_by_pk (
    pk_columns: {id: $id}
    _set: {
      name: $name,
      longitude: $longitude,
      latitude: $latitude,
      type: $minion_type,
      antenna_type: $antenna_type
    }
  ) {
    id
    name
    type
    antenna_type
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
}
`;

export const GQL_DELETE_MINION = (ids) => gql`
mutation {
  delete_signal_db_minions (
    where: { id: { _in: [${ids.toString()}] } }
  ) {
    affected_rows
  }
}
`;