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

import React, { PureComponent } from 'react';
import { FormattedMessage } from 'localization';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import get from 'lodash.get';

import SidebarFactory from './side-panel/side-bar';
import PanelHeaderFactory from './side-panel/panel-header';
import MinionManagerFactory from './side-panel/minion-manager';
import MinionControlBarFactory from './side-panel/minion-panel/control-bar';
import LayerManagerFactory from './side-panel/layer-manager';
import FilterManagerFactory from './side-panel/filter-manager';
import InteractionManagerFactory from './side-panel/interaction-manager';
import MapManagerFactory from './side-panel/map-manager';
import PanelToggleFactory from './side-panel/panel-toggle';
import CustomPanelsFactory from './side-panel/custom-panel';

import {
  ADD_DATA_ID,
  ADD_MAP_STYLE_ID,
  DATA_TABLE_ID,
  EXPORT_DATA_ID,
  EXPORT_MAP_ID,
  SHARE_MAP_ID,
  SIDEBAR_PANELS,
  OVERWRITE_MAP_ID,
  SAVE_MAP_ID,
  EXPORT_IMAGE_ID,
  INPUT_USER_TOKEN_ID
} from 'constants/default-settings';

const SidePanelContent = styled.div`
  ${props => props.theme.sidePanelScrollBar};
  flex-grow: 1;
  padding: ${props => props.theme.sidePanelInnerPadding}px;
  overflow-x: hidden;

  .side-panel__content__inner {
    display: flex;
    height: 100%;
    flex-direction: column;
  }
`;

export const PanelTitleFactory = () => styled.div`
  color: ${props => props.theme.titleTextColor};
  font-size: ${props => props.theme.sidePanelTitleFontsize};
  line-height: ${props => props.theme.sidePanelTitleLineHeight};
  font-weight: 400;
  letter-spacing: 1.25px;
  margin-bottom: 14px;
`;

SidePanelFactory.deps = [
  SidebarFactory,
  PanelHeaderFactory,
  PanelToggleFactory,
  PanelTitleFactory,
  MinionManagerFactory,
  MinionControlBarFactory,
  LayerManagerFactory,
  FilterManagerFactory,
  InteractionManagerFactory,
  MapManagerFactory,
  CustomPanelsFactory
];

/**
 *
 * Vertical sidebar containing input components for the rendering layers
 */
export default function SidePanelFactory(
  Sidebar,
  PanelHeader,
  PanelToggle,
  PanelTitle,
  MinionManager,
  MinionControlBar,
  LayerManager,
  FilterManager,
  InteractionManager,
  MapManager,
  CustomPanels
) {
  const customPanels = get(CustomPanels, ['defaultProps', 'panels']) || [];
  const getCustomPanelProps = get(CustomPanels, ['defaultProps', 'getProps']) || (() => ({}));

  class SidePanel extends PureComponent {
    static propTypes = {
      filters: PropTypes.arrayOf(PropTypes.any).isRequired,
      interactionConfig: PropTypes.object.isRequired,
      layerBlending: PropTypes.string.isRequired,
      layers: PropTypes.arrayOf(PropTypes.any).isRequired,
      mapProfile: PropTypes.object.isRequired,
      layerClasses: PropTypes.object.isRequired,
      mapStyle: PropTypes.object.isRequired,
      width: PropTypes.number.isRequired,
      datasets: PropTypes.object.isRequired,
      minionStateActions: PropTypes.object.isRequired,
      visStateActions: PropTypes.object.isRequired,
      mapStyleActions: PropTypes.object.isRequired,
      mapProfileActions: PropTypes.object.isRequired,
      availableProviders: PropTypes.object,
      mapSaved: PropTypes.string,
      panels: PropTypes.arrayOf(PropTypes.object)
    };

    static defaultProps = {
      panels: SIDEBAR_PANELS,
      uiState: {},
      minionState: {},
      minionStateActions: {},
      visStateActions: {},
      mapStyleActions: {},
      mapProfileActions: {},
      uiStateActions: {},
      availableProviders: {}
    };

    /* component private functions */
    _onOpenOrClose = () => {
      this.props.uiStateActions.toggleSidePanel(
        this.props.uiState.activeSidePanel ? null : 'minion'
      );
    };

    _showDatasetTable = dataId => {
      // this will open data table modal
      this.props.visStateActions.showDatasetTable(dataId);
      this.props.uiStateActions.toggleModal(DATA_TABLE_ID);
    };

    _showAddDataModal = () => {
      this.props.uiStateActions.toggleModal(ADD_DATA_ID);
    };

    _showAddMapStyleModal = () => {
      this.props.uiStateActions.toggleModal(ADD_MAP_STYLE_ID);
    };

    _showInputTokenModal = () => {
      this.props.uiStateActions.toggleModal(INPUT_USER_TOKEN_ID);
    }

    _removeDataset = key => {
      // this will show the modal dialog to confirm deletion
      this.props.uiStateActions.openDeleteModal(key);
    };

    _deleteFilteredData = (datasetId) => {
      this.props.uiStateActions.openDeleteDataModal(datasetId);
    };

    _setupDataset = key => {
      this.props.uiStateActions.openDatasetModal(key);
    };

    _onClickExportImage = () => this.props.uiStateActions.toggleModal(EXPORT_IMAGE_ID);

    _onClickExportData = () => this.props.uiStateActions.toggleModal(EXPORT_DATA_ID);

    _onClickExportMap = () => this.props.uiStateActions.toggleModal(EXPORT_MAP_ID);

    _onClickSaveToStorage = () =>
      this.props.uiStateActions.toggleModal(this.props.mapSaved ? OVERWRITE_MAP_ID : SAVE_MAP_ID);

    _onClickSaveAsToStorage = () => {
      // add (copy) to file name
      this.props.visStateActions.setMapInfo({
        title: `${this.props.mapInfo.title || 'Kepler.gl'} (Copy)`
      });

      this.props.uiStateActions.toggleModal(SAVE_MAP_ID);
    };

    _onClickShareMap = () => this.props.uiStateActions.toggleModal(SHARE_MAP_ID);

    // eslint-disable-next-line complexity
    render() {
      const {
        appName,
        appWebsite,
        version,
        datasets,
        filters,
        layers,
        mapProfile,
        layerBlending,
        layerClasses,
        uiState,
        minionState,
        authState,
        layerOrder,
        interactionConfig,
        minionStateActions,
        visStateActions,
        mapStyleActions,
        mapStateActions,
        mapProfileActions,
        uiStateActions,
        providerActions,
        availableProviders
      } = this.props;

      const { activeSidePanel } = uiState;
      const isOpen = Boolean(activeSidePanel);
      const panels = [...this.props.panels, ...customPanels];

      const minionControlBarActions = {
        selectAll: minionStateActions.selectAll,
        expand: minionStateActions.expand,
        collapse: minionStateActions.collapse,
        setMarkerScale: minionStateActions.setMarkerScale
      };

      const minionManagerActions = {
        updateVisData: visStateActions.updateVisData,
        onMouseMove: visStateActions.onMouseMove,
        updateMap: mapStateActions.updateMap,
        addMarker: visStateActions.addMarker,
        removeMarker: visStateActions.removeMarker,

        setLoopingEnabled: minionStateActions.setLoopingEnabled,
        loadMinions: minionStateActions.loadMinions,
        selectMinion: minionStateActions.selectMinion,
        unselectMinion: minionStateActions.unselectMinion,
        setOperationMode: minionStateActions.setOperationMode,
        setSleepInterval: minionStateActions.setSleepInterval,
        setSessionId: minionStateActions.setSessionId,
        sendSessionCommand: minionStateActions.sendSessionCommand,
        setCommand: minionStateActions.setCommand,
        sendCommand: minionStateActions.sendCommand,
        setMqttClient: minionStateActions.setMqttClient,
        setMqttMessage: minionStateActions.setMqttMessage,
        loadMinionCommand: minionStateActions.loadMinionCommand,
      };

      const layerManagerActions = {
        addLayer: visStateActions.addLayer,
        layerConfigChange: visStateActions.layerConfigChange,
        layerColorUIChange: visStateActions.layerColorUIChange,
        layerTextLabelChange: visStateActions.layerTextLabelChange,
        layerVisualChannelConfigChange: visStateActions.layerVisualChannelConfigChange,
        layerTypeChange: visStateActions.layerTypeChange,
        layerVisConfigChange: visStateActions.layerVisConfigChange,
        updateLayerBlending: visStateActions.updateLayerBlending,
        updateLayerOrder: visStateActions.reorderLayer,
        showDatasetTable: this._showDatasetTable,
        showAddDataModal: this._showAddDataModal,
        removeLayer: visStateActions.removeLayer,
        removeDataset: this._removeDataset,
        startReloadingDataset: visStateActions.startReloadingDataset,
        setupDataset: this._setupDataset,
        enableDataset: visStateActions.enableDataset,
        loadDataset: providerActions.loadDataset,
        openModal: uiStateActions.toggleModal
      };

      const filterManagerActions = {
        addFilter: visStateActions.addFilter,
        removeFilter: visStateActions.removeFilter,
        deleteFilteredData: visStateActions.deleteFilteredData,
        moveUpFilter: visStateActions.moveUpFilter,
        moveDownFilter: visStateActions.moveDownFilter,
        setFilter: visStateActions.setFilter,
        deleteFilteredData: this._deleteFilteredData,
        showDatasetTable: this._showDatasetTable,
        removeDataset: this._removeDataset,
        startReloadingDataset: visStateActions.startReloadingDataset,
        setupDataset: this._setupDataset,
        enableDataset: visStateActions.enableDataset,
        showAddDataModal: this._showAddDataModal,
        toggleAnimation: visStateActions.toggleFilterAnimation,
        enlargeFilter: visStateActions.enlargeFilter,
        toggleFilterFeature: visStateActions.toggleFilterFeature
      };

      const interactionManagerActions = {
        onConfigChange: visStateActions.interactionConfigChange
      };

      const mapManagerActions = {
        addMapStyleUrl: mapStyleActions.addMapStyleUrl,
        onConfigChange: mapStyleActions.mapConfigChange,
        onStyleChange: mapStyleActions.mapStyleChange,
        onBuildingChange: mapStyleActions.mapBuildingChange,
        set3dBuildingColor: mapStyleActions.set3dBuildingColor,
        loadProfile: mapProfileActions.loadProfile,
        addProfile: mapProfileActions.addProfile,
        updateProfile: mapProfileActions.updateProfile,
        removeProfile: mapProfileActions.removeProfile,
        applyProfile: mapProfileActions.applyProfile,
        updateProfileLabel: mapProfileActions.updateProfileLabel,
        showAddMapStyleModal: this._showAddMapStyleModal
      };

      return (
        <div>
          <Sidebar
            width={this.props.width}
            isOpen={isOpen}
            minifiedWidth={0}
            onOpenOrClose={this._onOpenOrClose}
          >
            <PanelHeader
              appName={appName}
              version={version}
              appWebsite={appWebsite}
              userRole={authState.userRole}
              visibleDropdown={uiState.visibleDropdown}
              showExportDropdown={uiStateActions.showExportDropdown}
              hideExportDropdown={uiStateActions.hideExportDropdown}
              onExportImage={this._onClickExportImage}
              onExportData={this._onClickExportData}
              onExportMap={this._onClickExportMap}
              onSaveMap={this.props.onSaveMap}
              onSaveToStorage={availableProviders.hasStorage ? this._onClickSaveToStorage : null}
              onSaveAsToStorage={
                availableProviders.hasStorage && this.props.mapSaved
                  ? this._onClickSaveAsToStorage
                  : null
              }
              onShareMap={availableProviders.hasShare ? this._onClickShareMap : null}
              onLogin={this._showInputTokenModal}
            />
            <PanelToggle
              panels={panels}
              activePanel={activeSidePanel}
              togglePanel={uiStateActions.toggleSidePanel}
            />
            <SidePanelContent className="side-panel__content" style={{ overflowY: activeSidePanel == 'minion' ? 'hidden' : 'scroll' }}>
              <div className="side-panel__content__inner">
                <PanelTitle className="side-panel__content__title">
                  <div style={{ float: 'left' }}>
                    <FormattedMessage
                      id={(panels.find(({ id }) => id === activeSidePanel) || {}).label}
                    />
                  </div>
                  {activeSidePanel == 'minion' ? (
                    <MinionControlBar
                      {...minionControlBarActions}
                      selectedAll={minionState.selectedAll}
                      markerScale={minionState.markerScale}
                    />
                  ) : null}
                </PanelTitle>
                {activeSidePanel === 'minion' && (
                  <MinionManager
                    {...minionManagerActions}
                    {...minionState}
                    {...authState}
                    width={this.props.width}
                    height={this.props.height - 54/*header*/ - 30 /*toggler*/ - 16 /*top-padding*/ - 48/*title*/}
                  />
                )}
                {activeSidePanel === 'layer' && (
                  <LayerManager
                    {...layerManagerActions}
                    {...authState}
                    datasets={datasets}
                    layers={layers}
                    layerClasses={layerClasses}
                    layerOrder={layerOrder}
                    layerBlending={layerBlending}
                    colorPalette={uiState.colorPalette}
                  />
                )}
                {activeSidePanel === 'filter' && (
                  <FilterManager
                    {...filterManagerActions}
                    datasets={datasets}
                    layers={layers}
                    filters={filters}
                    userRole={authState.userRole}
                  />
                )}
                {activeSidePanel === 'interaction' && (
                  <InteractionManager
                    {...interactionManagerActions}
                    datasets={datasets}
                    interactionConfig={interactionConfig}
                  />
                )}
                {activeSidePanel === 'map' && (
                  <MapManager {...mapManagerActions} mapStyle={this.props.mapStyle} mapProfile={this.props.mapProfile} {...authState} />
                )}
                {(customPanels || []).find(p => p.id === activeSidePanel) ? (
                  <CustomPanels
                    {...getCustomPanelProps(this.props)}
                    activeSidePanel={activeSidePanel}
                  />
                ) : null}
              </div>
            </SidePanelContent>
          </Sidebar>
        </div>
      );
    }
  }

  return SidePanel;
}
