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

import React, {Component, useCallback} from 'react';
import classnames from 'classnames';

import PropTypes from 'prop-types';
import styled from 'styled-components';
import {injectIntl} from 'react-intl';

import JqxGrid, { IGridProps, jqx } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxgrid';

// make sure the element is always visible while is being dragged
// item being dragged is appended in body, here to reset its global style
MinionManagerFactory.deps = [];

function MinionManagerFactory(AddDataButton, LayerPanel, SourceDataCatalog) {

  class MinionManager extends Component {
    static propTypes = {
      datasets: PropTypes.object.isRequired,
    };
    
    minionSource = {
      localdata: [],
      datatype: 'array',
      datafields: [
        { name: 'name', type: 'string' },
        { name: 'lastupdate', type: 'datetime' },
        { name: 'gps_fix_lastupdate', type: 'datetime' },
        { name: 'gps_fix', type: 'float' }
      ]
    };
    minionAdapter = new jqx.dataAdapter(this.minionSource);
    minionColumns = [
      { text: 'Name', datafield: 'name', cellsalign: 'center', align: 'center' },
      { text: 'LU', datafield: 'lastupdate', cellsalign: 'center', align: 'center' },
      { text: 'GFLU', datafield: 'gps_fix_lastupdate', align: 'center', cellsalign: 'center' },
      { text: 'GF', datafield: 'gps_fix', cellsalign: 'center', align: 'center' }
    ];

    render() {
      return (
        <div className="layer-manager">
          <JqxGrid
            width={265}
            height={300}
            theme={'metrodark'}
            source={this.minionAdapter} 
            columns={this.minionColumns}
            pageable={false} 
            sortable={true} 
            altrows={true}
            enabletooltips={true} 
            editable={true} />
        </div>
      );
    }
  }
  return injectIntl(MinionManager);
}

export default MinionManagerFactory;
