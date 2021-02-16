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

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {Button, SidePanelSection} from 'components/common/styled-components';
import MapStyleSelectorFactory from 'components/side-panel/map-style-panel/map-style-selector';
import LayerGroupSelectorFactory from 'components/side-panel/map-style-panel/map-layer-selector';
import MapProfileSelectorFactory from 'components/side-panel/map-style-panel/map-profile-selector';

import {Add} from 'components/common/icons';
import {DEFAULT_LAYER_GROUPS} from 'constants/default-settings';
import ColorSelector from './layer-panel/color-selector';
import {createSelector} from 'reselect';
import {injectIntl} from 'react-intl';
import {FormattedMessage} from 'localization';

MapManagerFactory.deps = [MapStyleSelectorFactory, LayerGroupSelectorFactory, MapProfileSelectorFactory];

function MapManagerFactory(MapStyleSelector, LayerGroupSelector, MapProfileSelector) {
  class MapManager extends Component {
    static propTypes = {
      userRole: PropTypes.string.isRequired,
      mapStyle: PropTypes.object.isRequired,
      mapProfile: PropTypes.object.isRequired,
      onConfigChange: PropTypes.func.isRequired,
      onStyleChange: PropTypes.func.isRequired,
      showAddMapStyleModal: PropTypes.func.isRequired,
      loadProfile: PropTypes.func.isRequired,
      addProfile: PropTypes.func.isRequired,
      updateProfile: PropTypes.func.isRequired,
      removeProfile: PropTypes.func.isRequired,
      applyProfile: PropTypes.func.isRequired,
      updateProfileLabel: PropTypes.func.isRequired,
    };

    state = {
      isSelecting: false
    };

    buildingColorSelector = props => props.mapStyle.threeDBuildingColor;
    setColorSelector = props => props.set3dBuildingColor;

    _toggleSelecting = () => {
      this.setState({isSelecting: !this.state.isSelecting});
    };

    _selectStyle = val => {
      this.props.onStyleChange(val);
      this._toggleSelecting();
    };

    render() {
      const {mapStyle, intl, mapProfile, userRole} = this.props;
      const editableLayers = DEFAULT_LAYER_GROUPS.map(lg => lg.slug);
      const hasBuildingLayer = mapStyle.visibleLayerGroups['3d building'];
      const colorSetSelector = createSelector(
        this.buildingColorSelector,
        this.setColorSelector,
        (selectedColor, setColor) => [
          {
            selectedColor,
            setColor,
            isRange: false,
            label: intl.formatMessage({id: 'mapManager.3dBuildingColor'})
         }
        ]
      );

      const colorSets = colorSetSelector(this.props);

      return (
        <div className="map-style-panel">
          <div>
            <MapStyleSelector
              mapStyle={mapStyle}
              isSelecting={this.state.isSelecting}
              onChange={this._selectStyle}
              toggleActive={this._toggleSelecting}
            />
            {editableLayers.length ? (
              <LayerGroupSelector
                layers={mapStyle.visibleLayerGroups}
                editableLayers={editableLayers}
                topLayers={mapStyle.topLayerGroups}
                onChange={this.props.onConfigChange}
              />
            ) : null}
            <SidePanelSection>
              <ColorSelector colorSets={colorSets} disabled={!hasBuildingLayer} />
            </SidePanelSection>
            <SidePanelSection>
              <Button
                className="add-map-style-button"
                onClick={this.props.showAddMapStyleModal}
                secondary
              >
                <Add height="12px" />
                <FormattedMessage id={'mapManager.addMapStyle'} />
              </Button>
            </SidePanelSection>
            <MapProfileSelector
              userRole={userRole}
              mapProfile={mapProfile}
              addProfile={this.props.addProfile}
              updateProfile={this.props.updateProfile}
              applyProfile={this.props.applyProfile}
              removeProfile={this.props.removeProfile}
              updateProfileLabel={this.props.updateProfileLabel}
            />
          </div>
        </div>
      );
   }
 }

  const dispatchToProps = dispatch => ({dispatch});

  return injectIntl(connect(dispatchToProps)(MapManager));
}

export default MapManagerFactory;
