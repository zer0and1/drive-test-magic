// Copyright (c) 2020 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import moment from 'moment';

import JqxGrid, { jqx } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxgrid';
import JqxTreeGrid from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxtreegrid';
import JqxSplitter from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxsplitter';
import { gql } from '@apollo/client';
import $ from 'jquery';

import { FlyToInterpolator } from '@deck.gl/core';
import KeplerGlSchema from 'schemas';
import Processors from 'processors';

import {
  MINION_TRACKER_DATASET_NAME,
  MINION_TRACKER_LAYER_ID,
  MINION_TRACKER_GEO_OFFSET,
  MINION_TRACKER_ICON_COLOR,
  MINION_TRACKER_ICON_SIZE
} from 'constants/default-settings';

const MINION_TRAKER_ICON_LAYER = {
  id: MINION_TRACKER_LAYER_ID,
  type: 'icon',
  config: {
    label: 'Minion Tracker Layer',
    color: MINION_TRACKER_ICON_COLOR,
    dataId: MINION_TRACKER_DATASET_NAME,
    columns: {
      lat: 'lt',
      lng: 'ln',
      icon: 'icon',
      label: 'text'
    },
    isVisible: true,
    hidden: false,
    visConfig: {
      radius: MINION_TRACKER_ICON_SIZE
    }
  }
};

const PARSED_CONFIG = KeplerGlSchema.parseSavedConfig({
  version: 'v1',
  config: {
    visState: {
      layers: [MINION_TRAKER_ICON_LAYER]
    }
  }
});

const GQL_GET_MINIONS = gql`
  query MyQuery {
    signal_db_minions {
      id
      name
      lastupdate
      gps_fix_lastupdate
      gps_fix
    }
  }
  `;

// make sure the element is always visible while is being dragged
// item being dragged is appended in body, here to reset its global style
MinionManagerFactory.deps = [];

function MinionManagerFactory() {

  class MinionManager extends Component {
    static propTypes = {
      updateVisData: PropTypes.func.isRequired,
      removeDataset: PropTypes.func.isRequired,
      updateMap: PropTypes.func.isRequired,
      transitionDuration: PropTypes.number,
    };

    minionGridRef = createRef();
    detailGridRef = createRef();
    timeoutId = 0;
    prevLatitude = 0;
    prevLongitude = 0;

    datetimeRenderer(row, columnproperties, value) {
      const date = new Date(value);
      const now = new Date();
      const diff = now - date;

      return `<div style='text-align: center; margin-top: 9px;'>
        ${moment(date).format("YYYY-MM-DD HH:mm:ss")}
      </div>`;
    };

    minionSource = {
      localdata: [],
      datatype: 'array',
      datafields: [
        { name: 'id', type: 'int' },
        { name: 'name', type: 'string' },
        { name: 'lastupdate', type: 'date' },
        { name: 'gps_fix_lastupdate', type: 'date' },
        { name: 'gps_fix', type: 'boolean' }
      ]
    };
    minionAdapter = new jqx.dataAdapter(this.minionSource);
    minionColumns = [
      { text: 'Name', datafield: 'name', cellsalign: 'center', align: 'center', width: '20%' },
      { text: 'Last Update', datafield: 'lastupdate', cellsalign: 'center', cellsrenderer: this.datetimeRenderer, align: 'center', width: '35%' },
      { text: 'Last Fix', datafield: 'gps_fix_lastupdate', align: 'center', cellsalign: 'center', cellsrenderer: this.datetimeRenderer, width: '35%' },
      { text: 'Fix', datafield: 'gps_fix', cellsalign: 'center', columntype: 'checkbox', align: 'center', width: '10%' },
      { datafield: 'id', hidden: true }
    ];

    detailSource = {
      localdata: [],
      datatype: 'array',
      datafields: [
        { name: 'id', type: 'string' },
        { name: 'parentid', type: 'string' },
        { name: 'field', type: 'string' },
        { name: 'value', type: 'string' },
      ],
      hierarchy:
      {
        keyDataField: { name: 'id' },
        parentDataField: { name: 'parentid' }
      },
      id: 'id',
    };
    detailAdapter = new jqx.dataAdapter(this.detailSource);
    detailColumns = [
      { text: 'Group', datafield: 'id', cellsalign: 'center', align: 'center', width: '20%' },
      { text: 'Field', datafield: 'field', cellsalign: 'center', align: 'center', width: '40%' },
      { text: 'Value', datafield: 'value', cellsalign: 'center', align: 'center', width: '40%' },
    ];

    constructor(props) {
      super(props);

      this.minionRowselect = this.minionRowselect.bind(this);
    }

    componentDidMount() {
      this.loadMinions();
    }

    componentWillUnmount() {
      window.clearTimeout(this.timeoutId);
    }

    loadMinions() {
      apolloClient
        .query({ query: GQL_GET_MINIONS, fetchPolicy: 'network-only' })
        .then(result => {
          this.minionSource.localdata = result.data.signal_db_minions;
          this.refs.minionGrid.updatebounddata();
          this.timeoutId = window.setTimeout(this.loadMinions.bind(this), 2000);

          const idx = this.refs.minionGrid.getselectedrowindex();
          if (idx < 0) {
            return;
          }

          const row = this.refs.minionGrid.getrowdata(idx);
          this.minionRowselect({ args: { row }, looping: true });
        });
    }

    minionRowselect({ args, looping }) {
      looping || $(this.refs.detailGrid._componentSelector).LoadingOverlay('show');

      const { row } = args;
      apolloClient
        .query({
          query: gql`
          query MyQuery {
            signal_db_minions(where: {id: {_eq: "${row.id}"}}) {
              name
              lastupdate
              session_id
              operation_mode
              longitude
              latitude
              gps_sat
              gps_precision
              gps_fix_lastupdate
              gps_fix
              command
              command_id
              command_id_ack
              sleep_interval
              aux
            }
            signal_db_signal_samples(where:{minion_id: {_eq: "${row.name}"}, date: {}}, limit: 1) {
              minion_id
              mcc_mnc
              minion_dl_rate
              longitude
              latitude
              id
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
          }`,
          fetchPolicy: 'network-only'
        })
        .then(result => {
          $(this.refs.detailGrid._componentSelector).LoadingOverlay('hide', true);

          const minionData = result.data.signal_db_minions?.[0];
          const sampleData = result.data.signal_db_signal_samples?.[0];
          const data = new Array;

          for (let field in minionData) {
            field == '__typename' || data.push({ field, value: minionData[field], id: field, parentid: 'minion' });
          }

          for (let field in sampleData) {
            field == '__typename' || data.push({ field, value: sampleData[field], id: field, parentid: 'sample' });
          }

          data.push({ id: 'minion', parentid: null, field: null, value: null });
          data.push({ id: 'sample', parentid: null, field: null, value: null });
          
          if (this.detailSource.localdata.length) {
            data.forEach(row => {
              this.refs.detailGrid.updateRow(row.field, row);
            });
          }
          else {
            this.detailSource.localdata = data;
            this.refs.detailGrid.updateBoundData();  
          }
          
          // this.trackMinion(sampleData);
        });
    }

    trackMinion(data) {
      const { longitude, latitude } = data;

      this.props.removeDataset(MINION_TRACKER_DATASET_NAME);
      this.props.updateVisData(
        [{
          data: Processors.processRowObject([
            {
              lt: latitude,
              ln: longitude,
              icon: 'place',
            }
          ]),
          info: {
            id: MINION_TRACKER_DATASET_NAME,
            label: MINION_TRACKER_DATASET_NAME
          }
        }],
        {
          keepExistingConfig: true
        },
        PARSED_CONFIG
      );

      this.props.updateMap({
        latitude,
        longitude,
        pitch: 0,
        bearing: 0,
        transitionDuration: this.props.transitionDuration,
        transitionInterpolator: new FlyToInterpolator()
      });
    }

    render() {
      return (
        <div className="minion-manager">
          <JqxSplitter
            style={{ marginLeft: '-16px' }}
            theme={'metrodark'}
            width={this.props.width}
            height={this.props.height}
            panels={[{ size: this.props.height * 0.4 }, { size: this.props.height * 0.6 }]}
            orientation={"horizontal"}
          >
            <div className={"splitter-panel"}>
              <JqxGrid
                ref={'minionGrid'}
                width={'100%'}
                height={'100%'}
                theme={'metrodark'}
                source={this.minionAdapter}
                columns={this.minionColumns}
                rowsheight={26}
                pageable={false}
                sortable={true}
                altrows={true}
                enabletooltips={true}
                editable={false}
                onRowselect={this.minionRowselect}
              />
            </div>
            <div className={"splitter-panel"}>
              <JqxTreeGrid
                ref={'detailGrid'}
                width={'100%'}
                height={'100%'}
                theme={'metrodark'}
                source={this.detailAdapter}
                columns={this.detailColumns}
                rowsheight={26}
                pageable={false}
                sortable={true}
                enableHover={false}
                selectionMode={'none'}
                altrows={true}
                enabletooltips={true}
                editable={false}
              />
            </div>
          </JqxSplitter>
        </div>
      );
    }
  }
  return injectIntl(MinionManager);
}

export default MinionManagerFactory;
