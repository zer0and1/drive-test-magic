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
import styled from 'styled-components';
import moment from 'moment-timezone';

import $ from 'jquery';
import JqxGrid, { jqx } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxgrid';
import JqxSplitter from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxsplitter';

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
      onMouseMove: PropTypes.func.isRequired,
      updateMap: PropTypes.func.isRequired,
      addMarker: PropTypes.func.isRequired,
      removeMarker: PropTypes.func.isRequired,

      loadMinions: PropTypes.func.isRequired,
      setSelectedMinion: PropTypes.func.isRequired,
      setSleepInterval: PropTypes.func.isRequired,
      setOperationMode: PropTypes.func.isRequired,
      setSessionId: PropTypes.func.isRequired,
      sendSessionCommand: PropTypes.func.isRequired,
      setCommand: PropTypes.func.isRequired,
      sendCommand: PropTypes.func.isRequired,
      sleepInterval: PropTypes.number,
      operationMode: PropTypes.string,
      lastAck: PropTypes.string,
      sessionId: PropTypes.number,
      command: PropTypes.string,
      isCommandExecuting: PropTypes.bool,
      details: PropTypes.object,
    };

    static defaultProps = {
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
        { name: 'operation_mode', type: 'string' }
      ]
    };

    timeoutId = 0;
    panelRatio = 0.2;
    sortCol = null;
    sortDir = null;
    isResizingPanel = false;

    strRenderer(row, columnproperties, value) {
      return `<div style='text-align: center; margin-top: 5px;'>${value}</div>`
    };

    convertToHRTime(dateString) {
      const date = moment(dateString).format('YYYY-MM-DD HH:mm:ss');
      const now = moment.tz(new Date(), 'Europe/Paris').format('YYYY-MM-DD HH:mm:ss');
      let diff = moment(now).diff(moment(date), 'seconds');

      if (diff < 120 && diff > 10) {
        const mins = Math.floor(diff / 60);
        const secs = diff % 60;

        return mins ? `${mins}m ${secs}s ago` : `${secs}s ago`;
      }
      else if (diff <= 10) {
        return 'Just Now';
      }

      return date;
    }

    datetimeRenderer(row, columnproperties, value) {
      return this.strRenderer(row, columnproperties, this.convertToHRTime(value));
    };

    constructor(props) {
      super(props);
      this.minionRowselect = this.minionRowselect.bind(this);
    }

    componentDidMount() {
      $('#minion-grid').LoadingOverlay('show');
      this.props.loadMinions(this.onMinionsLoaded.bind(this));
      this._mounted = true;
    }

    componentWillUnmount() {
      this.props.removeMarker();
      this.props.setSelectedMinion({ name: null, idx: -1 });
      clearTimeout(this.timeoutId);
      this._mounted = false;
    }

    shouldComponentUpdate() {
      if (this.isResizingPanel) {
        return false;
      }

      return true;
    }

    onMinionsLoaded(selected, minions) {
      if (this._mounted == false) {
        return;
      }

      $('#minion-grid').LoadingOverlay('hide', true);
      $('#minion-group').LoadingOverlay('hide', true);

      this.minionSource.localdata = minions;
      this.refs.minionGrid.updatebounddata();

      this.timeoutId = setTimeout(this.props.loadMinions.bind(this), 5000, this.onMinionsLoaded.bind(this));
      this.trackMinion(minions);
    }

    trackMinion(minions) {
      this.props.removeMarker();
      this.props.addMarker(
        minions.map(m => ({
          lngLat: [m.longitude, m.latitude],
          info: m,
          id: m.name
        }))
      );

      // this.props.updateMap({
      //   latitude,
      //   longitude,
      // });
    }

    onPanelResize({ args }) {
      this.panelRatio = args.panels[0].size / this.props.height;
      this.isResizingPanel = false;
    }

    minionRowselect({ args: { row: { name }, rowindex } }) {
      $('#minion-group').LoadingOverlay('show');
      this.props.setSelectedMinion({ name, idx: rowindex });
      this.props.loadMinions(this.onMinionsLoaded.bind(this));
    }

    render() {
      const { width, height } = this.props;
      const commandGroupFields = {
        sleepInterval: this.props.sleepInterval,
        operationMode: this.props.operationMode,
        lastAck: this.props.lastAck,
        sessionId: this.props.sessionId,
        command: this.props.command,
        commands: this.props.commands,
        isCommandExecuting: this.props.isCommandExecuting,
      };
      const commandGroupActions = {
        setSleepInterval: this.props.setSleepInterval,
        setOperationMode: this.props.setOperationMode,
        setSessionId: this.props.setSessionId,
        sendSessionCommand: this.props.sendSessionCommand,
        setCommand: this.props.setCommand,
        sendCommand: this.props.sendCommand,
        setMqttClient: this.props.setMqttClient,
        setMqttMessage: this.props.setMqttMessage,
        loadMinionCommand: this.props.loadMinionCommand,
      };

      return (
        <div className="minion-manager">
          <JqxSplitter
            style={{ marginLeft: '-16px' }}
            theme={'metrodark'}
            width={width}
            height={height}
            panels={[{ size: height * this.panelRatio, collapsible: false }, { size: height * (1 - this.panelRatio), collapsible: true }]}
            orientation={"horizontal"}
            onResize={this.onPanelResize.bind(this)}
            onResizeStart={() => { this.isResizingPanel = true }}
          >
            <div className={"splitter-panel"} id="minion-grid">
              <JqxGrid
                ref={'minionGrid'}
                width={'100%'}
                height={'100%'}
                theme={'metrodark'}
                source={new jqx.dataAdapter(this.minionSource)}
                columns={[
                  { text: 'Name', datafield: 'name', cellsalign: 'center', align: 'center', width: '20%', cellsrenderer: this.strRenderer.bind(this) },
                  { text: 'Last Update', datafield: 'lastupdate', cellsalign: 'center', cellsrenderer: this.datetimeRenderer.bind(this), align: 'center', width: '34%' },
                  { text: 'Last Fix', datafield: 'gps_fix_lastupdate', align: 'center', cellsalign: 'center', cellsrenderer: this.datetimeRenderer.bind(this), width: '34%' },
                  { text: 'Mode', datafield: 'operation_mode', cellsalign: 'center', align: 'center', cellsrenderer: this.strRenderer.bind(this), width: '12%' },
                  { datafield: 'id', hidden: true }
                ]}
                rowsheight={26}
                pageable={false}
                sortable={true}
                altrows={true}
                enabletooltips={true}
                editable={false}
                enablehover={false}
                onRowselect={this.minionRowselect}
                onSort={({ args: { sortinformation: { sortcolumn, sortdirection } } }) => {
                  this.sortCol = sortcolumn;
                  this.sortDir = sortcolumn ? (sortdirection.ascending ? 'asc' : 'desc') : null;
                }}
                onBindingcomplete={() => this.refs.minionGrid.sortby(this.sortCol, this.sortDir)}
              />
            </div>
            <StyledMinionGroup className={"splitter-panel"} id="minion-group">
              <GPSGroup data={this.props.details} />
              <MinionSignalSampleGroup data={this.props.details} />
              <CommandGroup {...commandGroupFields} {...commandGroupActions} />
            </StyledMinionGroup>
          </JqxSplitter>
        </div>
      );
    }
  }

  return injectIntl(MinionManager);
}

export default MinionManagerFactory;
