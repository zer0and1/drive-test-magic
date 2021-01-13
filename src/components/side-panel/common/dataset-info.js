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

import React, { Component } from 'react';
import styled from 'styled-components';
import { format } from 'd3-format';
import { FormattedMessage } from 'localization';
import moment from 'moment';

const numFormat = format(',');

const StyledDataRowCount = styled.div`
  font-size: 11px;
  color: ${props => props.theme.subtextColor};
  padding-left: 19px;
`;

export default function DatasetInfoFactory() {
  class DatasetInfo extends Component {
    state = {
      timeAgoLabel: ''
    };
    intervalId = null;

    componentDidMount() {
      this.intervalId = setInterval(this.updateTimeAgo.bind(this), 1000);
    }

    componentWillUnmount() {
      this.intervalId && clearInterval(this.intervalId);
    }

    updateTimeAgo() {
      const { dataset: { timestamp } } = this.props;
      let secs = moment().diff(timestamp, 'seconds');
      const mins = Math.floor(secs / 60);
      secs = secs % 60;

      if (mins == 0 && secs == 0) {
        this.setState({ timeAgoLabel: '=> just now' });
      }
      else {
        this.setState({ timeAgoLabel: `=> ${mins ? mins + 'm ' : ''} ${secs ? secs + 's' : ''} ago` });
      }
    }

    render() {
      const { dataset } = this.props;
      const { enabled } = dataset;
      const { timeAgoLabel } = this.state;

      return (
        <StyledDataRowCount className="source-data-rows">
          {enabled ? (
            <>
              <span>
                <FormattedMessage
                  id={'datasetInfo.rowCount'}
                  values={{ rowCount: numFormat(dataset.allData.length) }}
                />
              </span>
              <span style={{ marginLeft: '10px' }}>{timeAgoLabel}</span>
            </>
          ) : (
              <FormattedMessage
                id={'datasetInfo.hidden'}
              />
            )}
        </StyledDataRowCount>
      )
    }
  }

  return DatasetInfo;
}
