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

import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { FormattedMessage } from 'localization';

import { CenterFlexbox, Tooltip } from 'components/common/styled-components';
import { ArrowRight, Table, Trash, Reload, Spinner, EyeSeen, EyeUnseen, Gear } from 'components/common/icons';
import DatasetTagFactory from 'components/side-panel/common/dataset-tag';

import $ from 'jquery';
import 'gasparesganga-jquery-loading-overlay';

function nop() { }

const StyledDatasetTitle = styled.div`
  color: ${props => props.theme.textColor};
  display: flex;
  align-items: flex-start;

  .source-data-arrow {
    height: 16px;
  }

  :hover {
    cursor: ${props => (props.clickable ? 'pointer' : 'auto')};

    .dataset-name {
      color: ${props => (props.clickable ? props.theme.textColorHl : props.theme.textColor)};
    }

    .dataset-action {
      color: ${props => props.theme.textColor};
      opacity: 1;
    }

    .dataset-action:hover {
      color: ${props => props.theme.textColorHl};
    }
  }
`;

const DataTagAction = styled.div`
  margin-left: 12px;
  height: 16px;
  float: right;
  opacity: ${props => props.alwaysVisible ? 1 : 0};
`;

const ShowDataTable = ({ id, showDatasetTable = nop }) => (
  <DataTagAction className="dataset-action show-data-table" data-tip data-for={`data-table-${id}`}>
    <Table
      height="16px"
      onClick={e => {
        e.stopPropagation();
        showDatasetTable(id);
      }}
    />
    <Tooltip id={`data-table-${id}`} effect="solid">
      <span>
        <FormattedMessage id={'datasetTitle.showDataTable'} />
      </span>
    </Tooltip>
  </DataTagAction>
);

const RemoveDataset = ({ datasetKey, removeDataset = nop }) => (
  <DataTagAction
    className="dataset-action remove-dataset"
    data-tip
    data-for={`delete-${datasetKey}`}
  >
    <Trash
      height="16px"
      onClick={e => {
        e.stopPropagation();
        removeDataset(datasetKey);
      }}
    />
    <Tooltip id={`delete-${datasetKey}`} effect="solid" type="error">
      <span>
        <FormattedMessage id={'datasetTitle.removeDataset'} />
      </span>
    </Tooltip>
  </DataTagAction>
);

const ReloadDataset = ({ datasetKey, reloading, startReloadingDataset = nop }) => (
  <DataTagAction
    className="dataset-action reload-dataset"
    data-tip
    data-for={`reload-${datasetKey}`}
  >
    {reloading ? (
      <Spinner height="16px" />
    ) : (
      <Reload
        height="16px"
        onClick={e => {
          e.stopPropagation();
          startReloadingDataset(datasetKey);
        }}
      />
    )}

    <Tooltip id={`reload-${datasetKey}`} effect="solid">
      <span>
        <FormattedMessage id={'datasetTitle.reloadDataset'} />
      </span>
    </Tooltip>
  </DataTagAction>
);

const SetupDataset = ({ datasetKey, setupDataset = nop }) => (
  <DataTagAction
    className="dataset-action setup-dataset"
    data-tip
    data-for={`setup-${datasetKey}`}
  >
    <Gear
      height="16px"
      onClick={e => {
        e.stopPropagation();
        setupDataset(datasetKey);
      }}
    />
    <Tooltip id={`setup-${datasetKey}`} effect="solid">
      <span>
        <FormattedMessage id={'datasetTitle.setupDataset'} />
      </span>
    </Tooltip>
  </DataTagAction>
);

const EnableDataset = ({ datasetKey, enabled, enableDataset = nop }) => (
  <DataTagAction
    className="dataset-action enable-dataset"
    data-tip
    data-for={`enable-${datasetKey}`}
  >
    {enabled ? (
      <EyeSeen
        height="16px"
        onClick={e => {
          e.stopPropagation();
          enableDataset(datasetKey);
        }}
      />
    ) : (
        <EyeUnseen
          height="16px"
          onClick={e => {
            e.stopPropagation();
            enableDataset(datasetKey);
          }}
        />
      )}

    <Tooltip id={`enable-${datasetKey}`} effect="solid">
      <span>
        <FormattedMessage id={enabled ? 'datasetTitle.hideDataset' : 'datasetTitle.showDataset'} />
      </span>
    </Tooltip>
  </DataTagAction>
);

DatasetTitleFactory.deps = [DatasetTagFactory];

export default function DatasetTitleFactory(DatasetTag) {
  class DatasetTitle extends PureComponent {
    _onClickTitle = e => {
      e.stopPropagation();
      if (typeof this.props.onTitleClick === 'function') {
        this.props.onTitleClick();
      } else if (typeof this.props.showDatasetTable === 'function') {
        this.props.showDatasetTable(this.props.dataset.id);
      }
    };

    componentDidMount() {
      if (this.props.dataset.loadingCompleted) {
        $('.side-panel__content').LoadingOverlay('hide', true);
      }
    }

    render() {
      const {
        showDatasetTable,
        showDeleteDataset,
        onTitleClick,
        removeDataset,
        startReloadingDataset,
        setupDataset,
        enableDataset,
        dataset,
        userRole
      } = this.props;
      const hadDBPrivilege = userRole == 'admin' || userRole == 'user';

      return (
        <StyledDatasetTitle
          className="source-data-title"
          clickable={Boolean(showDatasetTable || onTitleClick)}
        >
          <DatasetTag dataset={dataset} onClick={this._onClickTitle} />
          {showDatasetTable ? (
            <CenterFlexbox className="source-data-arrow">
              <ArrowRight height="12px" />
            </CenterFlexbox>
          ) : null}
          { false ? (
            <ShowDataTable id={dataset.id} showDatasetTable={showDatasetTable} />
          ) : null}
          {showDeleteDataset && hadDBPrivilege ? (
            <RemoveDataset datasetKey={dataset.id} removeDataset={removeDataset} />
          ) : null}
          {hadDBPrivilege && <SetupDataset datasetKey={dataset.id} setupDataset={setupDataset} />}
          <ReloadDataset datasetKey={dataset.id} reloading={dataset.reloading} startReloadingDataset={startReloadingDataset} />
          <EnableDataset datasetKey={dataset.id} enableDataset={enableDataset} enabled={dataset.enabled} />
        </StyledDatasetTitle>
      );
    }
  }

  return DatasetTitle;
}
