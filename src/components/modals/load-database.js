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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  StyledExportSection,
} from 'components/common/styled-components';
import Switch from 'components/common/switch';
import JqxGrid, { jqx } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxgrid';
import JqxExpander from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxexpander';

import LoadingDialog from './loading-dialog';
import { Button } from 'components/common/styled-components';
import { FormattedMessage } from 'localization';
import PanelHeaderActionFactory from 'components/side-panel/panel-header-action';
import { Reload, Play } from 'components/common/icons';
import { media } from 'styles/media-breakpoints';

const StyledInput = styled.input`
  width: 100%;
  padding: ${props => props.theme.inputPadding};
  color: ${props => (props.error ? 'red' : props.theme.titleColorLT)};
  height: ${props => props.theme.inputBoxHeight};
  outline: 0;
  font-size: 16px;

  :active,
  :focus,
  &.focus,
  &.active {
    outline: 0;
  }
`;

const StyledTextArea = styled.textarea`
  width: 100%;
  height: 25vh;
  resize: none;
  padding: ${props => props.theme.inputPadding};
  outline: 0;
  font-size: 16px;

  :active,
  :focus,
  &.focus,
  &.active {
    outline: 0;
  }
`;

const StyledSection = styled.div`
  float: left;
  white-space: nowrap;
  width: ${props => props.width};
  height: ${props => props.height ? props.height : 'fit-content'};
`;

const StyledErrorMessage = styled.div`
  color: red;
  font-size: 12px;
`;

const StyledModalFooter = styled.div`
  width: 100%;
  left: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-top: 24px;
  ${media.portable`
    padding-top: 24px;
  `};

  ${media.palm`
    padding-top: 16px;
  `};
  z-index: ${props => props.theme.modalFooterZ};
`;

const FooterActionWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

LoadDatabaseFactory.deps = [PanelHeaderActionFactory];

function LoadDatabaseFactory(PanelHeaderAction) {
  class LoadDatabase extends Component {
    static propTypes = {
      setDatasetLabel: PropTypes.func.isRequired,
      setQuery: PropTypes.func.isRequired,
      setSessionChecked: PropTypes.func.isRequired,
      setQueryExpanded: PropTypes.func.isRequired,
      setSessionExpanded: PropTypes.func.isRequired,
      reloadSession: PropTypes.func.isRequired,
      selectSession: PropTypes.func.isRequired,
      datasetLabel: PropTypes.string.isRequired,
      labelError: PropTypes.string,
      query: PropTypes.string.isRequired,
      queryError: PropTypes.string,
      isCheckedSession: PropTypes.bool.isRequired,
      isExpandedQuery: PropTypes.bool.isRequired,
      isExpandedSession: PropTypes.bool.isRequired,
      isLoadingSession: PropTypes.bool.isRequired,
      isAvailableSessionId: PropTypes.bool.isRequired,
      sessions: PropTypes.array.isRequired,
      
      updating: PropTypes.bool,
      oldDataset: PropTypes.object
    };

    static defaultProps = {
      updating: false,
      oldDataset: {}
    };

    componentDidMount() {
      if (this.props.updating) {
        this.props.initDataset(this.props.oldDataset);
      }
    }

    _addDataset() {
      let selectedSessions = [];
      const { updating, oldDataset } = this.props;
      if (this.props.isCheckedSession && this.refs?.sessionGrid) {
        const rows = this.refs.sessionGrid.getrows();
        selectedSessions = rows.filter(row => row.selected).map(row => row.id);
      }

      this.props.addDataset({ selectedSessions, updating, oldDataset });
    }

    render() {
      const {
        isExpandedQuery,
        isExpandedSession,
        isCheckedSession,
        isLoadingSession,
        isAvailableSessionId,
        datasetLabel,
        labelError,
        query,
        queryError,
        queryTestError,
        queryTestResult,
        queryTestTime,
        sessions,
        updating
      } = this.props;


      return (
        <div style={{ marginTop: updating ? '0px' : '-50px' }}>
          <StyledExportSection>
            <div className="description">
              <div className="title">
                <FormattedMessage id={'modal.loadDatabase.datasetTitle'} />
              </div>
              <div className="subtitle">
                <FormattedMessage id={'modal.loadDatabase.datasetSubtitle'} />
              </div>
            </div>
            <div className="selection">
              <StyledInput type="text" value={datasetLabel} onChange={e => this.props.setDatasetLabel(e.target.value)} />
              {labelError && (
                <StyledErrorMessage>
                  {labelError}
                </StyledErrorMessage>
              )}
            </div>
          </StyledExportSection>
          <StyledExportSection>
            <div className="description">
              <div className="title">
                <StyledSection width="50%">
                  <FormattedMessage id={'modal.loadDatabase.queryTitle'} />
                </StyledSection>
                <StyledSection width="50%" height="20px" style={{ marginTop: '2px' }}>
                  {(queryError || query == '') ? null : (
                    <PanelHeaderAction
                      tooltip={'tooltip.testQuery'}
                      IconComponent={Play}
                      color={"primaryBtnBgd"}
                      hoverColor={"primaryBtnBgdHover"}
                      onClick={() => this.props.testQuery()}
                    />
                  )}
                </StyledSection>
              </div>
              <div className="subtitle">
                {queryTestError && (
                  <p style={{ color: 'red' }}>
                    Query Testing Error!
                    <br />
                    {queryTestError}
                  </p>
                )}
                {queryTestResult && (
                  <div>
                    <p style={{ color: 'green' }}>
                      Query Successful!
                      <br />
                      {queryTestResult.length} rows in {Math.round(queryTestTime / 1000)} sec
                    </p>
                  </div>
                )}
                {(queryTestError || queryTestResult) ? null : (
                  <FormattedMessage id={'modal.loadDatabase.querySubtitle'} />
                )}
              </div>
            </div>
            <div className="selection">
              <JqxExpander
                width='100%'
                theme="material"
                expanded={isExpandedQuery}
                animationType="none"
                onExpanding={() => this.props.setQueryExpanded(true)}
                onCollapsing={() => this.props.setQueryExpanded(false)}
              >
                <div>Query Editor</div>
                <div style={{ padding: '0px', border: 'none' }}>
                  {isLoadingSession ? <LoadingDialog size="64" height="25vh" /> : (
                    <>
                      <StyledTextArea rows="10" height="25vh" onChange={e => this.props.setQuery(e.target.value)} value={query} />
                      {queryError && (
                        <StyledErrorMessage>
                          {queryError}
                        </StyledErrorMessage>
                      )}
                    </>
                  )}
                </div>
              </JqxExpander>
            </div>
          </StyledExportSection>
          {
            isAvailableSessionId && !queryError && !queryTestError && (
              <StyledExportSection>
                <div className="description">
                  <div className="title">
                    <StyledSection width="12%" height="15px" style={{ marginTop: '1px' }}>
                      <Switch
                        id="load-database-session"
                        type="checkbox"
                        checked={isCheckedSession}
                        onChange={() => {
                          this.props.setSessionChecked(!isCheckedSession)
                        }}
                      />
                    </StyledSection>
                    <StyledSection width="50%">
                      <FormattedMessage id={'modal.loadDatabase.sessionTitle'} />
                    </StyledSection>
                    <StyledSection width="38%" height="20px" style={{ marginTop: '2px' }}>
                      {isCheckedSession && !isLoadingSession && (
                        <PanelHeaderAction
                          tooltip={'tooltip.reloadSession'}
                          IconComponent={Reload}
                          onClick={() => this.props.reloadSession()}
                        />
                      )}
                    </StyledSection>
                  </div>
                  <div className="subtitle">
                    <FormattedMessage id={'modal.loadDatabase.sessionSubtitle'} />
                  </div>
                </div>
                <div className="selection">
                  {isCheckedSession && (
                    <JqxExpander
                      width='100%'
                      theme="material"
                      animationType="none"
                      expanded={isExpandedSession}
                      onExpanding={() => this.props.setSessionExpanded(true)}
                      onCollapsing={() => this.props.setSessionExpanded(false)}
                    >
                      <div>
                        Session Selector
                    </div>
                      <div style={{ padding: '0px', border: 'none' }}>
                        {isLoadingSession ? <LoadingDialog size="64" height="25vh" /> : (<div style={{ height: '25vh' }}>
                          <JqxGrid
                            ref={'sessionGrid'}
                            width={'100%'}
                            height={'100%'}
                            theme={'material'}
                            source={new jqx.dataAdapter({
                              localdata: sessions.map(s => this.props.selectedSessions.findIndex(id => id == s.id) >= 0 ? { ...s, selected: true } : s),
                              datatype: 'array',
                              datafields: [
                                { name: 'id', type: 'int' },
                                { name: 'startDate', type: 'string' },
                                { name: 'endDate', type: 'string' },
                                { name: 'count', type: 'int' },
                                { name: 'selected', type: 'boolean' }
                              ]
                            })}
                            columns={[
                              { text: 'ID', datafield: 'id', cellsalign: 'center', align: 'center', editable: false, width: '10%' },
                              { text: 'Start Date', datafield: 'startDate', cellsalign: 'center', align: 'center', editable: false, width: '35%' },
                              { text: 'End Date', datafield: 'endDate', align: 'center', cellsalign: 'center', editable: false, width: '35%' },
                              { text: 'Count', datafield: 'count', cellsalign: 'center', align: 'center', editable: false, width: '15%' },
                              { text: '✔', datafield: 'selected', columntype: 'checkbox', cellsalign: 'center', align: 'center', editable: true, width: '5%' },
                            ]}
                            rowsheight={30}
                            columnsheight={25}
                            pageable={false}
                            sortable={true}
                            altrows={true}
                            editable={true}
                          />
                        </div>
                        )}
                      </div>
                    </JqxExpander>
                  )}
                </div>
              </StyledExportSection>
            )
          }
          <StyledModalFooter>
            <FooterActionWrapper>
              <Button className="modal--footer--cancel-button" link onClick={this.props.onClose}>
                <FormattedMessage id={'modal.button.defaultCancel'} />
              </Button>
              <Button className="modal--footer--confirm-button" onClick={this._addDataset.bind(this)} >
                {updating ? (
                  <FormattedMessage id={'modal.button.update'} />
                ) : (
                    <FormattedMessage id={'modal.button.add'} />
                  )}
              </Button>
            </FooterActionWrapper>
          </StyledModalFooter>
        </div >
      );
    }
  }
  return LoadDatabase;
}

export default LoadDatabaseFactory;
