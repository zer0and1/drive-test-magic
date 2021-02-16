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

import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'localization';
import { Button, SidePanelDivider, SidePanelSection } from 'components/common/styled-components';
import { Add, Trash } from 'components/common/icons';
import SourceDataCatalogFactory from './common/source-data-catalog';
import FilterPanelFactory from './filter-panel/filter-panel';

FilterManagerFactory.deps = [SourceDataCatalogFactory, FilterPanelFactory];

function FilterManagerFactory(SourceDataCatalog, FilterPanel) {
  const FilterManager = ({
    filters = [],
    datasets,
    layers,
    userRole,
    showDatasetTable,
    addFilter,
    setFilter,
    removeFilter,
    deleteFilteredData,
    moveUpFilter,
    moveDownFilter,
    enlargeFilter,
    toggleAnimation,
    toggleFilterFeature
  }) => {
    const isAnyFilterAnimating = filters.some(f => f.isAnimating);
    const hadEmptyFilter = filters.some(f => !f.name);
    const hadDataset = Object.keys(datasets).length;
    const signalDataset = Object.values(datasets).find(({ query }) => query.indexOf('signal_db_signal_samples_view'));
    const hadFilteredData = signalDataset && signalDataset.filteredIndex.length < signalDataset.allIndexes.length;

    const onClickAddFilter = useCallback(() => {
      const defaultDataset = (Object.keys(datasets).length && Object.values(datasets).sort((a, b) => a.label > b.label ? 1 : -1)[0].id) || null;
      addFilter(defaultDataset);
    }, [datasets, addFilter]);

    return (
      <div className="filter-manager">
        <SourceDataCatalog datasets={datasets} showDatasetTable={showDatasetTable} />
        <SidePanelDivider />
        <SidePanelSection>
          {filters.map((filter, idx) => (
            <FilterPanel
              key={`${filter.id}-${idx}`}
              idx={idx}
              filters={filters}
              filter={{ ...filter, first: idx == 0, last: idx == filters.length - 1 }}
              datasets={datasets}
              layers={layers}
              isAnyFilterAnimating={isAnyFilterAnimating}
              removeFilter={() => removeFilter(idx)}
              moveUpFilter={() => moveUpFilter(filter.id)}
              moveDownFilter={() => moveDownFilter(filter.id)}
              enlargeFilter={() => enlargeFilter(idx)}
              toggleAnimation={() => toggleAnimation(idx)}
              toggleFilterFeature={() => toggleFilterFeature(idx)}
              setFilter={setFilter}
            />
          ))}
        </SidePanelSection>
        <Button
          className="add-filter-button"
          inactive={hadEmptyFilter || !hadDataset}
          width="105px"
          onClick={onClickAddFilter}
        >
          <Add height="12px" />
          <FormattedMessage id={'filterManager.addFilter'} />
        </Button>
        {userRole == 'admin' && (
          <Button
            className="delete-filtered-data"
            disabled={hadEmptyFilter}
            width="40px"
            negative
            style={{ padding: '5px 3px 5px 11px', float: 'right', textAlign: 'center' }}
            onClick={() => deleteFilteredData(signalDataset.id)}
          >
            <Trash height="20px" />
          </Button>
        )}
      </div>
    );
  };

  FilterManager.propTypes = {
    datasets: PropTypes.object,
    layers: PropTypes.arrayOf(PropTypes.any).isRequired,
    addFilter: PropTypes.func.isRequired,
    removeFilter: PropTypes.func.isRequired,
    moveUpFilter: PropTypes.func.isRequired,
    moveDownFilter: PropTypes.func.isRequired,
    enlargeFilter: PropTypes.func.isRequired,
    toggleAnimation: PropTypes.func.isRequired,
    toggleFilterFeature: PropTypes.func.isRequired,
    setFilter: PropTypes.func.isRequired,
    filters: PropTypes.arrayOf(PropTypes.any).isRequired,
    showDatasetTable: PropTypes.func,

    // fields can be undefined when dataset is not selected
    fields: PropTypes.arrayOf(PropTypes.any)
  };

  return FilterManager;
}

export default FilterManagerFactory;
