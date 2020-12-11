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

import React, {Component, useCallback, createRef} from 'react';
import classnames from 'classnames';

import PropTypes from 'prop-types';
import styled from 'styled-components';
import {injectIntl} from 'react-intl';
import moment from 'moment';

import {
  Button,
  PanelLabel,
  SidePanelDivider,
  SidePanelSection
} from 'components/common/styled-components';

import JqxGrid, { IGridProps, jqx } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxgrid';
import { useQuery, gql } from '@apollo/client';
import $ from 'jquery';

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

function MinionManagerFactory(AddDataButton, LayerPanel, SourceDataCatalog) {

  class MinionManager extends Component {
    minionGridRef = createRef();
    detailGridRef = createRef();

    datetimeRenderer(row, columnproperties, value) {
      return `<div style='text-align: center; margin-top: 7px;'>
        ${moment(new Date(value)).format("YYYY-MM-DD HH:mm:ss")}
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
      { text: 'LU', datafield: 'lastupdate', cellsalign: 'center', cellsrenderer: this.datetimeRenderer, align: 'center', width: '35%' },
      { text: 'GFLU', datafield: 'gps_fix_lastupdate', align: 'center', cellsalign: 'center', cellsrenderer: this.datetimeRenderer, width: '35%' },
      { text: 'GF', datafield: 'gps_fix', cellsalign: 'center', columntype: 'checkbox', align: 'center', width: '10%' },
      { datafield: 'id', hidden: true }
    ];

    detailSource = {
      localdata: [],
      datatype: 'array',
      datafields: [
        { name: 'field', type: 'string0' },
        { name: 'value', type: 'string' },
      ]
    };
    detailAdapter = new jqx.dataAdapter(this.detailSource);
    detailColumns = [
      { text: 'Field', datafield: 'field', cellsalign: 'center', align: 'center' },
      { text: 'Value', datafield: 'value', cellsalign: 'center', align: 'center' },
    ];

    constructor (props) {
      super(props);

      this.minionRowselect = this.minionRowselect.bind(this);
    }

    componentDidMount() {
      apolloClient
        .query({ query: GQL_GET_MINIONS })
        .then(result => {
          this.minionSource.localdata = result.data.signal_db_minions;
          this.refs.minionGrid.updatebounddata();
        });
    }

    minionRowselect({ args }) {
      $('.side-bar').LoadingOverlay('show');

      const {row} = args;
      apolloClient
        .query({ query: gql`
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
          }
        `})
        .then(result => {
          $('.side-bar').LoadingOverlay('hide', true);

          const minionData = result.data.signal_db_minions?.[0];
          const sampleData = result.data.signal_db_signal_samples?.[0];
          const data = new Array;

          for(let field in minionData) {
            field == '__typename' || data.push({ field, value: minionData[field] });
          }
          
          for(let field in sampleData) {
            field == '__typename' || data.push({ field, value: sampleData[field] });
          }

          this.detailSource.localdata = data;
          this.refs.detailGrid.updatebounddata();
        });
    }

    render() {
      const contentHeight = this.props.height - 24;

      return (
        <div className="minion-manager">
          <JqxGrid
            style={{ marginLeft: '-16px' }}
            ref={'minionGrid'}
            width={this.props.width}
            height={contentHeight * 0.5}
            theme={'metrodark'}
            source={this.minionAdapter} 
            columns={this.minionColumns}
            pageable={false} 
            sortable={true} 
            altrows={true}
            enabletooltips={true} 
            editable={false} 
            onRowselect={this.minionRowselect}
          />
          <SidePanelDivider/>
          <JqxGrid
            style={{ marginLeft: '-16px' }}
            ref={'detailGrid'}
            width={this.props.width}
            height={contentHeight * 0.5}
            theme={'metrodark'}
            source={this.detailAdapter} 
            columns={this.detailColumns}
            pageable={false} 
            sortable={true} 
            altrows={true}
            enabletooltips={true} 
            editable={false} 
          />
        </div>
      );
    }
  }
  return injectIntl(MinionManager);
}

export default MinionManagerFactory;
