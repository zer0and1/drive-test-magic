import { gql } from '@apollo/client';

export const GQL_GET_MINIONS = (minionId = '#') => gql`
query MyQuery {
  signal_db_minions {
    id
    name
    type
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
    mcs
    ri
    pmi
  }
}
`;

export const GQL_GET_MINION_COMMANDS = () => gql`
query MyQuery {
  signal_db_minion_commands {
    id, command
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