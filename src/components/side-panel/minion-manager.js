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
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import styled from 'styled-components';
import moment from 'moment-timezone';
import { FlyToInterpolator } from '@deck.gl/core';

import $ from 'jquery';
import JqxGrid, { jqx } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxgrid';
import JqxSplitter from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxsplitter';
import 'gasparesganga-jquery-loading-overlay';

import { GQL_GET_MINIONS, GQL_GET_MINION_DETAILS } from 'graphqls';
import {SIGNAL_QUALITY} from 'constants/default-settings';
import GPSGroupFactory from './minion-panel/gps-group';
import SignalSampleGroupFactory from './minion-panel/signal-sample-group';
import CommandGroupFactory from './minion-panel/command-group';

const StyledMinionGroup = styled.div`
  ${props => props.theme.sidePanelScrollBar};
  overflow-y: auto;
  padding: 5px;
`;

// make sure the element is always visible while is being dragged
// item being dragged is appended in body, here to reset its global style
MinionManagerFactory.deps = [GPSGroupFactory, SignalSampleGroupFactory, CommandGroupFactory];

function MinionManagerFactory(GPSGroup, MinionSignalSampleGroup, CommandGroup) {

  class MinionManager extends Component {
    static propTypes = {
      updateVisData: PropTypes.func.isRequired,
      removeDataset: PropTypes.func.isRequired,
      updateMap: PropTypes.func.isRequired,
      addMarker: PropTypes.func.isRequired,
      removeMarker: PropTypes.func.isRequired,
      transitionDuration: PropTypes.number,
    };

    minionGridRef = createRef();
    timeoutId = 0;
    panelRatio = 0.2;

    strRenderer(row, columnproperties, value) {
      return `<div style='text-align: center; margin-top: 5px;'>${value}</div>`
    };

    datetimeRenderer(row, columnproperties, value) {
      const date = moment(value).format('YYYY-MM-DD HH:mm:ss');
      const now = moment.tz(new Date(), 'Europe/Paris').format('YYYY-MM-DD HH:mm:ss');
      const diff = moment(now).diff(moment(date), 'seconds');

      if (diff < 120) {
        const mins = Math.floor(diff / 60);
        const secs = diff % 60;

        return this.strRenderer(row, columnproperties, mins ? `${mins}m ${secs}s ago` : `${secs}s ago`);
      }

      return this.strRenderer(row, columnproperties, date);
    };

    state = {
      details: {},
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
      { text: 'Name', datafield: 'name', cellsalign: 'center', align: 'center', width: '20%', cellsrenderer: this.strRenderer },
      { text: 'Last Update', datafield: 'lastupdate', cellsalign: 'center', cellsrenderer: this.datetimeRenderer.bind(this), align: 'center', width: '35%' },
      { text: 'Last Fix', datafield: 'gps_fix_lastupdate', align: 'center', cellsalign: 'center', cellsrenderer: this.datetimeRenderer.bind(this), width: '35%' },
      { text: 'Fix', datafield: 'gps_fix', cellsalign: 'center', columntype: 'checkbox', align: 'center', width: '10%' },
      { datafield: 'id', hidden: true }
    ];

    constructor(props) {
      super(props);
      this.minionRowselect = this.minionRowselect.bind(this);
      this._mounted = true;
    }

    componentDidMount() {
      this.loadMinions(false);
    }

    componentWillUnmount() {
      this.props.removeMarker();
      window.clearTimeout(this.timeoutId);
      this._mounted = false;
    }

    loadMinions(looping) {
      looping || $('#minion-grid').LoadingOverlay('show');

      apolloClient
        .query({ query: GQL_GET_MINIONS, fetchPolicy: 'network-only' })
        .then(result => {
          looping || $('#minion-grid').LoadingOverlay('hide', true);

          this.minionSource.localdata = result.data.signal_db_minions;
          this.refs.minionGrid.updatebounddata();
          this.timeoutId = this._mounted && window.setTimeout(this.loadMinions.bind(this), 15000, true);

          const idx = this.refs.minionGrid.getselectedrowindex();
          if (idx < 0) {
            return;
          }

          const row = this.refs.minionGrid.getrowdata(idx);
          this._mounted && this.minionRowselect({ args: { row }, looping: true });
        });
    }

    minionRowselect({ args, looping }) {
      looping || $('#minion-group').LoadingOverlay('show');

      const { row } = args;
      apolloClient
        .query({
          query: GQL_GET_MINION_DETAILS(row),
          fetchPolicy: 'network-only'
        })
        .then(result => {
          looping || $('#minion-group').LoadingOverlay('hide', true);

          const minionData = result.data.signal_db_minions?.[0];
          const sampleData = result.data.signal_db_signal_samples?.[0];

          const calcLevel = (val, factor) => {
            const map = factor == 'sinr_ecio' ? SIGNAL_QUALITY[sampleData.connection_type == 'LTE' ? 'sinr' : 'ecio'] : SIGNAL_QUALITY[factor];

            for (let i = 1; i < 5; i++) {
              if (parseInt(val) >= parseInt(map[i])) {
                return {
                  [factor + '_level']: i - 1,
                  [factor + '_prog']: (4 - i) * 25 + 25 * (val - map[i]) / (map[i - 1] - map[i])
                };
              }
            }

            return {
              [factor + '_level']: 4,
              [factor + '_prog']: 0
            };
          };

          this.setState({
            details: {
              ...minionData,
              ...sampleData,
              ...calcLevel(sampleData.rssi, 'rssi'),
              ...calcLevel(sampleData.rsrq, 'rsrq'),
              ...calcLevel(sampleData.rsrp_rscp, 'rsrp_rscp'),
              ...calcLevel(sampleData.sinr_ecio, 'sinr_ecio'),
              cqi: 0,
            }
          });

          this.trackMinion(sampleData);
        });
    }

    trackMinion(data) {
      const { latitude, longitude } = data;
      this.props.addMarker({ center: true, lng: longitude, lat: latitude, color: 'red', info: { label: data.minion_id } });
      this.props.updateMap({
        latitude,
        longitude,
        pitch: 0,
        bearing: 0,
        transitionDuration: 1000,
        transitionInterpolator: new FlyToInterpolator()
      });
    }

    onPanelResize({ args }) {
      this.panelRatio = args.panels[0].size / this.props.height;
    }

    render() {
      return (
        <div className="minion-manager">
          <JqxSplitter
            style={{ marginLeft: '-16px' }}
            theme={'metrodark'}
            width={this.props.width}
            height={this.props.height}
            panels={[{ size: this.props.height * this.panelRatio, collapsible: false }, { size: this.props.height * (1 - this.panelRatio), collapsible: true }]}
            orientation={"horizontal"}
            onResize={this.onPanelResize.bind(this)}
          >
            <div className={"splitter-panel"} id="minion-grid">
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
            <StyledMinionGroup className={"splitter-panel"} id="minion-group">
              <GPSGroup data={this.state.details} />
              <MinionSignalSampleGroup data={this.state.details} />
              <CommandGroup />
            </StyledMinionGroup>
          </JqxSplitter>
        </div>
      );
    }
  }

  const dispatchToProps = dispatch => ({ dispatch });
  const mapToProps = state => state.main.keplerGl;

  return injectIntl(connect(mapToProps, dispatchToProps)(MinionManager));
}

export default MinionManagerFactory;
