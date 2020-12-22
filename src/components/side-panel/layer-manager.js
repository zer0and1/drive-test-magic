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

import React, { Component, useCallback } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import { sortableContainer, sortableElement } from 'react-sortable-hoc';
import styled from 'styled-components';
import { createSelector } from 'reselect';
import { injectIntl } from 'react-intl';
import { FormattedMessage } from 'localization';
import { arrayMove } from 'utils/data-utils';

import LayerPanelFactory from './layer-panel/layer-panel';
import SourceDataCatalogFactory from './common/source-data-catalog';
import { Add } from 'components/common/icons';
import ItemSelector from 'components/common/item-selector/item-selector';
import {
  Button,
  PanelLabel,
  SidePanelDivider,
  SidePanelSection
} from 'components/common/styled-components';

import { LAYER_BLENDINGS } from 'constants/default-settings';

import $ from 'jquery';
import 'gasparesganga-jquery-loading-overlay';

import { GQL_GET_SIGNAL_SAMPLES } from 'graphqls';
import { getFieldsFromData } from 'processors';
import { addDataToMap } from 'actions/index.js';

const LayerBlendingSelector = ({ layerBlending, updateLayerBlending, intl }) => {
  const labeledLayerBlendings = Object.keys(LAYER_BLENDINGS).reduce(
    (acc, current) => ({
      ...acc,
      [intl.formatMessage({ id: LAYER_BLENDINGS[current].label })]: current
    }),
    {}
  );

  const onChange = useCallback(blending => updateLayerBlending(labeledLayerBlendings[blending]), [
    updateLayerBlending,
    labeledLayerBlendings
  ]);

  return (
    <SidePanelSection>
      <PanelLabel>
        <FormattedMessage id="layerBlending.title" />
      </PanelLabel>
      <ItemSelector
        selectedItems={intl.formatMessage({ id: LAYER_BLENDINGS[layerBlending].label })}
        options={Object.keys(labeledLayerBlendings)}
        multiSelect={false}
        searchable={false}
        onChange={onChange}
      />
    </SidePanelSection>
  );
};

// make sure the element is always visible while is being dragged
// item being dragged is appended in body, here to reset its global style
const SortableStyledItem = styled.div`
  z-index: ${props => props.theme.dropdownWrapperZ + 1};

  &.sorting {
    pointer-events: none;
  }

  &.sorting-layers .layer-panel__header {
    background-color: ${props => props.theme.panelBackgroundHover};
    font-family: ${props => props.theme.fontFamily};
    font-weight: ${props => props.theme.fontWeight};
    font-size: ${props => props.theme.fontSize};
    line-height: ${props => props.theme.lineHeight};
    *,
    *:before,
    *:after {
      box-sizing: border-box;
    }
    .layer__drag-handle {
      opacity: 1;
      color: ${props => props.theme.textColorHl};
    }
  }
`;

export function AddDataButtonFactory() {
  const AddDataButton = ({ onClick, isInactive }) => (
    <Button
      className="add-data-button"
      onClick={onClick}
      isInactive={!isInactive}
      width="105px"
      secondary
    >
      <Add height="12px" />
      <FormattedMessage id={'layerManager.addData'} />
    </Button>
  );

  return AddDataButton;
}

LayerManagerFactory.deps = [AddDataButtonFactory, LayerPanelFactory, SourceDataCatalogFactory];

function LayerManagerFactory(AddDataButton, LayerPanel, SourceDataCatalog) {
  // By wrapping layer panel using a sortable element we don't have to implement the drag and drop logic into the panel itself;
  // Developers can provide any layer panel implementation and it will still be sortable
  const SortableItem = sortableElement(({ children, isSorting }) => {
    return (
      <SortableStyledItem className={classnames('sortable-layer-items', { sorting: isSorting })}>
        {children}
      </SortableStyledItem>
    );
  });

  const SortableContainer = sortableContainer(({ children }) => {
    return <div>{children}</div>;
  });

  class LayerManager extends Component {
    static propTypes = {
      datasets: PropTypes.object.isRequired,
      layerBlending: PropTypes.string.isRequired,
      layerClasses: PropTypes.object.isRequired,
      layers: PropTypes.arrayOf(PropTypes.any).isRequired,
      // functions
      addLayer: PropTypes.func.isRequired,
      layerColorUIChange: PropTypes.func.isRequired,
      layerConfigChange: PropTypes.func.isRequired,
      layerTextLabelChange: PropTypes.func.isRequired,
      layerVisualChannelConfigChange: PropTypes.func.isRequired,
      layerTypeChange: PropTypes.func.isRequired,
      layerVisConfigChange: PropTypes.func.isRequired,
      openModal: PropTypes.func.isRequired,
      removeLayer: PropTypes.func.isRequired,
      removeDataset: PropTypes.func.isRequired,
      showDatasetTable: PropTypes.func.isRequired,
      updateLayerBlending: PropTypes.func.isRequired,
      updateLayerOrder: PropTypes.func.isRequired
    };
    state = {
      isSorting: false
    };

    componentDidMount() {
      this.loadData()
    }

    loadData() {
      if (this.props.datasets.signal_sample_data) {
        return;
      }
      
      $('#kepler-container').LoadingOverlay('show');

      apolloClient.query({ query: GQL_GET_SIGNAL_SAMPLES })
        .then(result => {
          const data = result.data.signal_db_signal_samples_view;
          const order = ['aux', 'bs_latitude', 'bs_longitude', 'cell_id', 'cell_name', 'connection_state',
            'connection_type', 'cqi', 'date', 'dl_chan_bandwidth', 'duplex_mode', 'enodeb_id', 'freq_arfcn',
            'freq_band', 'freq_mhz_dl', 'freq_mhz_ul', 'latitude', 'longitude', 'mcc_mnc', 'minion_dl_rate',
            'minion_id', 'minion_module_firmware', 'minion_module_type', 'minion_state', 'minion_target_ping_ms',
            'minion_ul_rate', 'pcid', 'rsrp_rscp', 'rsrq', 'rssi', 'session_id', 'sinr_ecio', 'ul_chan_bandwidth'
          ];
          const fields = getFieldsFromData(data, order);
          const rows = new Array;

          data.forEach(item => {
            rows.push(order.map(field => item[field]));
          });

          this.props.dispatch(
            addDataToMap({
              datasets: {
                info: {
                  label: 'Signal Samples',
                  id: 'signal_sample_data'
                },
                data: { fields, rows }
              },
              options: {
                centerMap: true,
                readOnly: false
              },
              config: {
                version: 'v1',
                config: {
                  visState: {
                    layers: [
                      {
                        type: 'point',
                        config: {
                          dataId: 'signal_sample_data',
                          columns: {
                            lat: 'latitude',
                            lng: 'longitude'
                          },
                          isVisible: true
                        }
                      }
                    ]
                  }
                }
              }
            })
          );
          
          $('#kepler-container').LoadingOverlay('hide', true);
        })
    }

    layerClassSelector = props => props.layerClasses;
    layerTypeOptionsSelector = createSelector(this.layerClassSelector, layerClasses =>
      Object.keys(layerClasses).map(key => {
        const layer = new layerClasses[key]();
        return {
          id: key,
          label: layer.name,
          icon: layer.layerIcon,
          requireData: layer.requireData
        };
      })
    );

    _addEmptyNewLayer = () => {
      this.props.addLayer();
    };

    _handleSort = ({ oldIndex, newIndex }) => {
      this.props.updateLayerOrder(arrayMove(this.props.layerOrder, oldIndex, newIndex));
      this.setState({ isSorting: false });
    };

    _onSortStart = () => {
      this.setState({ isSorting: true });
    };

    _updateBeforeSortStart = ({ index }) => {
      // if layer config is active, close it
      const { layerOrder, layers, layerConfigChange } = this.props;
      const layerIdx = layerOrder[index];
      if (layers[layerIdx].config.isConfigActive) {
        layerConfigChange(layers[layerIdx], { isConfigActive: false });
      }
    };

    render() {
      const { layers, datasets, layerOrder, openModal, intl } = this.props;
      const defaultDataset = Object.keys(datasets)[0];
      const layerTypeOptions = this.layerTypeOptionsSelector(this.props);

      const layerActions = {
        layerColorUIChange: this.props.layerColorUIChange,
        layerConfigChange: this.props.layerConfigChange,
        layerVisualChannelConfigChange: this.props.layerVisualChannelConfigChange,
        layerTypeChange: this.props.layerTypeChange,
        layerVisConfigChange: this.props.layerVisConfigChange,
        layerTextLabelChange: this.props.layerTextLabelChange,
        removeLayer: this.props.removeLayer
      };

      const panelProps = {
        datasets,
        openModal,
        layerTypeOptions
      };

      return (
        <div className="layer-manager">
          <SourceDataCatalog
            datasets={datasets}
            showDatasetTable={this.props.showDatasetTable}
            removeDataset={this.props.removeDataset}
            showDeleteDataset
          />
          <AddDataButton onClick={this.props.showAddDataModal} isInactive={!defaultDataset} />
          <SidePanelDivider />
          <SidePanelSection>
            <SortableContainer
              onSortEnd={this._handleSort}
              onSortStart={this._onSortStart}
              updateBeforeSortStart={this._updateBeforeSortStart}
              lockAxis="y"
              helperClass="sorting-layers"
              useDragHandle
            >
              {layerOrder.map(
                (layerIdx, index) =>
                  !layers[layerIdx].config.hidden && (
                    <SortableItem
                      key={`layer-${layerIdx}`}
                      index={index}
                      isSorting={this.state.isSorting}
                    >
                      <LayerPanel
                        {...panelProps}
                        {...layerActions}
                        sortData={layerIdx}
                        key={layers[layerIdx].id}
                        idx={layerIdx}
                        layer={layers[layerIdx]}
                      />
                    </SortableItem>
                  )
              )}
            </SortableContainer>
          </SidePanelSection>
          <SidePanelSection>
            {defaultDataset ? (
              <Button className="add-layer-button" onClick={this._addEmptyNewLayer} width="105px">
                <Add height="12px" />
                <FormattedMessage id={'layerManager.addLayer'} />
              </Button>
            ) : null}
          </SidePanelSection>
          <LayerBlendingSelector
            layerBlending={this.props.layerBlending}
            updateLayerBlending={this.props.updateLayerBlending}
            intl={intl}
          />
        </div>
      );
    }
  }

  const dispatchToProps = dispatch => ({ dispatch });

  return injectIntl(connect(null, dispatchToProps)(LayerManager));
}

export default LayerManagerFactory;
