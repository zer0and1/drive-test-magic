// Copyright (c) 2021 Uber Technologies, Inc.
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
import JqxWindow from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxwindow';
import JqxInput from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxinput';
import JqxDropDownList from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxdropdownlist';
import { Button, SidePanelSection } from 'components/common/styled-components';
import { Settings, Add, Trash, Picker } from 'components/common/icons';
import { FormattedMessage } from 'localization';

import WebMercatorViewport from 'viewport-mercator-project';

import GPSGroupFactory from './minion-panel/gps-group';
import SignalSampleGroupFactory from './minion-panel/signal-sample-group';
import CommandGroupFactory from './minion-panel/command-group';
import { USER_ROLES } from 'constants/default-settings';

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
      removeMarker: PropTypes.func.isRequired,
      setLoopingEnabled: PropTypes.func.isRequired,
      loadMinions: PropTypes.func.isRequired,
      selectMinion: PropTypes.func.isRequired,
      setSleepInterval: PropTypes.func.isRequired,
      setOperationMode: PropTypes.func.isRequired,
      setSessionId: PropTypes.func.isRequired,
      sendSessionCommand: PropTypes.func.isRequired,
      setCommand: PropTypes.func.isRequired,
      sendCommand: PropTypes.func.isRequired,
      addMinion: PropTypes.func.isRequired,
      updateMinion: PropTypes.func.isRequired,
      deleteMinion: PropTypes.func.isRequired,
    };

    static defaultProps = {
      details: {},
    };

    timeoutId = 0;
    panelRatio = 0.3;
    sortCol = null;
    sortDir = null;
    isResizingPanel = false;
    isSelectingAll = false;
    isUnselectingAll = false;
    selectedMinion = null;

    editWnd = createRef();
    confirmWnd = createRef();
    minionName = createRef();
    minionType = createRef();
    antennaType = createRef();
    latitude = createRef();
    longitude = createRef();

    strRenderer(row, columnproperties, value) {
      const color = value == 'never seen' ? 'grey' : 'white';
      return `
        <div style='text-align: center; margin-top: 5px; color: ${color}'>
          ${value}
        </div>
      `;
    };

    convertToHRTime(dateString) {
      if (!dateString) {
        return 'never seen';
      }

      const date = moment(dateString).format('YYYY-MM-DD HH:mm:ss');
      const now = moment().format('YYYY-MM-DD HH:mm:ss');
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

    lastupdateRenderer(row, columnproperties, value) {
      return this.strRenderer(row, columnproperties, this.convertToHRTime(value));
    }

    lastfixRenderer(row, columnproperties, value) {
      const { type } = arguments[5];
      return this.strRenderer(row, columnproperties, type == 'fixed' ? 'FWA' : this.convertToHRTime(value));
    }

    constructor(props) {
      super(props);
      this.minionRowselect = this.minionRowselect.bind(this);
      this.minionRowunselect = this.minionRowunselect.bind(this);
    }

    componentDidMount() {
      this._mounted = true;
      const {userRole, setLoopingEnabled, loadMinions} = this.props;

      setLoopingEnabled(true);

      if (userRole && userRole != USER_ROLES.NOT_ALLOWED) {
        loadMinions(true);
      }
    }

    componentWillUnmount() {
      this.props.removeMarker();
      this.props.selectMinion([]);
      this.props.setLoopingEnabled(false);
      this.closeEditWindow();
      this._mounted = false;
    }

    shouldComponentUpdate(nextProps) {
      const { minions } = nextProps;
      this.isSelectingAll = nextProps.isSelectingAll;
      this.isUnselectingAll = nextProps.isUnselectingAll;
      global.minionGridRef = this.refs.minionGrid;

      if (nextProps.isSelectingAll) {
        this.refs.minionGrid.selectallrows();
        this.props.selectMinion(minions);
      }

      if (nextProps.isUnselectingAll) {
        this.refs.minionGrid.clearselection();
        this.props.selectMinion([]);
      }

      if (this.isResizingPanel) {
        return false;
      }

      return true;
    }

    onPanelResize({ args }) {
      this.panelRatio = args.panels[0].size / this.props.height;
      this.isResizingPanel = false;
    }

    minionRowselect() {
      if (this.isSelectingAll) {
        return;
      }

      const idxs = this.refs.minionGrid.getselectedrowindexes();
      const rows = idxs.map(idx => this.refs.minionGrid.getrowdata(idx));
      const minions = rows.map(m => this.props.minions.find(om => om.name == m.name));
      this.props.selectMinion(minions);

      if (minions.length == 1) {
        $('#minion-group').LoadingOverlay('show');
        this.selectedMinion = minions[0];
        this.props.loadMinions();
      }
    }

    minionRowunselect() {
      if (this.isUnselectingAll) {
        return;
      }

      const idxs = this.refs.minionGrid.getselectedrowindexes();
      const rowsData = this.refs.minionGrid.getdisplayrows();
      const rows = idxs.map(idx => rowsData[idx]);
      const minions = rows.map(m => this.props.minions.find(om => om.name == m.name));
      this.props.selectMinion(minions);

      if (minions.length == 1) {
        $('#minion-group').LoadingOverlay('show');
        this.props.loadMinions();
      }
    }

    openEditWindow() {
      this.editWnd.current?.open();
      this.editWnd.current?.move(460, 20);
    }

    closeEditWindow() {
      this.editWnd.current?.close();
    }

    openConfirmWindow() {
      this.confirmWnd.current?.open();
      this.confirmWnd.current?.move(460, 20);
    }

    closeConfirmWindow() {
      this.confirmWnd.current?.close();
    }

    addButtonClick() {
      this.latitude.current.val('0');
      this.longitude.current.val('0');
      this.minionName.current.val('dt-minion-x');
      this.minionType.current.val('fixed');
      this.editingMode = 'add';
      this.openEditWindow();
    }

    updateButtonClick() {
      const { id, longitude, latitude, name, type, antenna_type } = this.props.details;
      this.latitude.current.val(latitude);
      this.longitude.current.val(longitude);
      this.minionName.current.val(name);
      this.minionType.current.val(type);
      this.antennaType.current.val(antenna_type);
      this.editingMode = 'update';
      this.minionToUpdate = id;
      this.openEditWindow();
    }

    deleteButtonClick() {
      this.openConfirmWindow();
    }

    confirmButtonClick() {
      const { selectedMinions } = this.props;
      this.props.deleteMinion(selectedMinions.map(m => m.id));
      this.closeConfirmWindow();
    }

    pickerButtonClick() {
      if (this.minionType.current.val() == 'mobile') {
        return;
      }

      const overlay = document.getElementById('default-deckgl-overlay');
      overlay.style.cursor = 'crosshair';

      const mousedownHandler = ({ x, y, button }) => {
        this.clicked = (button == 0 ? { x, y } : { x: -1, y: -1 });
      };
      const mouseupHandler = ({ x, y }) => {
        if (this.clicked.x == x && this.clicked.y == y) {
          overlay.style.cursor = 'grab';

          const viewport = new WebMercatorViewport(this.props.mapState);
          const [lng, lat] = viewport.unproject([x, y]);
          this.latitude.current?.val(lat);
          this.longitude.current?.val(lng);
        }
        else {
          overlay.addEventListener('mousedown', mousedownHandler, { once: true });
          overlay.addEventListener('mouseup', mouseupHandler, { once: true });
        }
      };

      overlay.addEventListener('mousedown', mousedownHandler, { once: true });
      overlay.addEventListener('mouseup', mouseupHandler, { once: true });
    }

    saveButtonClick() {
      const data = {
        latitude: this.latitude.current.val(),
        longitude: this.longitude.current.val(),
        minion_type: this.minionType.current.val(),
        antenna_type: this.antennaType.current.val(),
        name: this.minionName.current.val(),
      };

      if (this.editingMode == 'add') {
        this.props.addMinion(data);
      }
      else {
        this.props.updateMinion(this.minionToUpdate, data)
      }

      this.closeEditWindow();
    }

    cancelButtonClick() {
      this.closeEditWindow();
    }

    render() {
      const { 
        width, 
        height, 
        selectedMinions, 
        minions, 
        details,
        userRole 
      } = this.props;

      const commandGroupFields = {
        sleepInterval: this.props.sleepInterval,
        operationMode: this.props.operationMode,
        lastAck: this.props.lastAck,
        selectedMinions,
        sessionId: this.props.sessionId,
        command: this.props.command,
        commands: this.props.commands,
        selectedAll: this.props.selectedAll,
        isCommandExecuting: this.props.isCommandExecuting,
        userRole: this.props.userRole
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
        loadStaticData: this.props.loadStaticData,
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
                id="grid-minion"
                ref={'minionGrid'}
                width={'100%'}
                height={'100%'}
                style={{ paddingBottom: userRole == USER_ROLES.ADMIN ? '35px' : 0 }}
                theme={'metrodark'}
                source={new jqx.dataAdapter({
                  localdata: minions,
                  datatype: 'array',
                  datafields: [
                    { name: 'id', type: 'int' },
                    { name: 'name', type: 'string' },
                    { name: 'type', type: 'string' },
                    { name: 'lastupdate', type: 'date' },
                    { name: 'gps_fix_lastupdate', type: 'date' },
                    { name: 'operation_mode', type: 'string' }
                  ]
                })}
                columns={[
                  { text: 'Name', datafield: 'name', cellsalign: 'center', align: 'center', width: '20%', cellsrenderer: this.strRenderer.bind(this) },
                  { text: 'Last Update', datafield: 'lastupdate', cellsalign: 'center', cellsrenderer: this.lastupdateRenderer.bind(this), align: 'center', width: '34%' },
                  { text: 'Last Fix', datafield: 'gps_fix_lastupdate', align: 'center', cellsalign: 'center', cellsrenderer: this.lastfixRenderer.bind(this), width: '34%' },
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
                selectionmode={'multiplerowsadvanced'}
                onRowselect={this.minionRowselect}
                onSort={({ args: { sortinformation: { sortcolumn, sortdirection } } }) => {
                  this.sortCol = sortcolumn;
                  this.sortDir = sortcolumn ? (sortdirection.ascending ? 'asc' : 'desc') : null;
                }}
                onBindingcomplete={() => this.refs.minionGrid.sortby(this.sortCol, this.sortDir)}
              />
              {userRole == USER_ROLES.ADMIN && (<SidePanelSection style={{ height: '35px', padding: '5px', marginTop: '-35px' }}>
                <Button primary style={{ padding: '5px' }} onClick={this.addButtonClick.bind(this)}>
                  <Add height="12px" />
                  Add
                </Button>
                <Button
                  cta
                  style={{ marginLeft: '5px', padding: '5px' }}
                  onClick={this.updateButtonClick.bind(this)}
                  disabled={selectedMinions.length != 1}
                >
                  <Settings height="12px" />
                  Edit
                </Button>
                <Button
                  negative
                  disabled={selectedMinions.length == 0}
                  style={{ padding: '5px 5px 5px 11px', float: 'right', textAlign: 'center' }}
                  onClick={this.openConfirmWindow.bind(this)}
                >
                  <Trash height="15px" />
                </Button>
              </SidePanelSection>)}
            </div>
            <StyledMinionGroup className={"splitter-panel"} id="minion-group">
              <GPSGroup data={details} disabled={selectedMinions.length > 1} />
              <MinionSignalSampleGroup data={details} disabled={selectedMinions.length > 1} />
              <CommandGroup {...commandGroupFields} {...commandGroupActions} />
            </StyledMinionGroup>
          </JqxSplitter>
          <JqxWindow ref={this.editWnd} theme={"metrodark"} width={280} height={230} autoOpen={false} resizable={false}>
            <div>Minion Edit</div>
            <div style={{ overflow: 'hidden' }}>
              <table style={{ width: '100%' }}>
                <tbody>
                  <tr>
                    <td align={'right'}>Name:</td>
                    <td align={'left'} colSpan={'2'}>
                      <JqxInput theme={"metrodark"} ref={this.minionName} width={192} height={23} />
                    </td>
                  </tr>
                  <tr>
                    <td align={'right'}>Type:</td>
                    <td align={'left'} colSpan={'2'}>
                      <JqxDropDownList
                        theme={"metrodark"}
                        ref={this.minionType}
                        width={190}
                        height={23}
                        autoDropDownHeight={true}
                        source={['mobile', 'fixed']}
                        onChange={({ args: { item: { value } } }) => {
                          if (value == 'mobile') {
                            this.latitude.current?.setOptions({ disabled: true });
                            this.longitude.current?.setOptions({ disabled: true });
                          }
                          else {
                            this.latitude.current?.setOptions({ disabled: false });
                            this.longitude.current?.setOptions({ disabled: false });
                          }
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td align={'right'}>Antenna:</td>
                    <td align={'left'} colSpan={'2'}>
                      <JqxDropDownList
                        ref={this.antennaType}
                        theme={"metrodark"}
                        width={190}
                        height={23}
                        autoDropDownHeight={true}
                        source={this.props.antennas}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td align={'right'}>Latitude:</td>
                    <td align={'left'} style={{ width: '156px' }}>
                      <JqxInput theme={"metrodark"} ref={this.latitude} width={145} height={23} />
                    </td>
                    <td rowSpan={'2'}>
                      <Button
                        link
                        style={{ padding: '5px 0px', border: '2px solid gray', borderRadius: '5px' }}
                        onClick={this.pickerButtonClick.bind(this)}
                      >
                        <Picker height={'30px'} style={{ margin: '0px', fill: 'currentcolor' }} />
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td align={'right'}>Longitude:</td>
                    <td align={'left'}>
                      <JqxInput theme={"metrodark"} ref={this.longitude} width={145} height={23} />
                    </td>
                  </tr>
                  <tr>
                    <td align={'right'} />
                    <td style={{ paddingTop: '10px' }} align={'right'} colSpan={'2'}>
                      <Button
                        style={{ display: 'inline-block', marginRight: '5px' }}
                        width={50}
                        onClick={this.saveButtonClick.bind(this)}
                      >
                        Save
                      </Button>
                      <Button
                        style={{ display: 'inline-block', marginRight: '5px' }}
                        width={50}
                        secondary
                        onClick={this.cancelButtonClick.bind(this)}
                      >
                        Cancel
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </JqxWindow>
          <JqxWindow
            ref={this.confirmWnd}
            theme={"metrodark"}
            width={250}
            height={115}
            autoOpen={false}
            resizable={false}
            isModal={true}
          >
            <div>Confirm Dialog</div>
            <div>
              <div style={{ padding: '10px' }}>
                Are you sure to delete minions selected?
              </div>
              <div>
                <Button
                  style={{ display: 'inline-block', marginRight: '5px', float: 'right' }}
                  width={50}
                  negative
                  onClick={this.confirmButtonClick.bind(this)}
                >
                  Delete
                </Button>
                <Button
                  style={{ display: 'inline-block', marginRight: '5px', float: 'right' }}
                  width={50}
                  secondary
                  onClick={this.closeConfirmWindow.bind(this)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </JqxWindow>
        </div>
      );
    }
  }

  return injectIntl(MinionManager);
}

export default MinionManagerFactory;
