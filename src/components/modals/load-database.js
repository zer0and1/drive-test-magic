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

import React, {Component, createRef} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {StyledExportSection} from 'components/common/styled-components';
import JqxGrid, {jqx} from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxgrid';

import LoadingDialog from './loading-dialog';
import {Button} from 'components/common/styled-components';
import {FormattedMessage} from 'localization';
import PanelHeaderActionFactory from 'components/side-panel/panel-header-action';
import {Reload, Play, Delete, Select} from 'components/common/icons';
import {media} from 'styles/media-breakpoints';

const StyledDBSection = styled(StyledExportSection)`
  margin: 32px 0px;
`;

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

const SessionSection = styled(StyledSection)`
  width: 50%;
  height: 20px;
  margin-top: 2px;
  display: flex;
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

class SessionGrid extends Component {
  componentDidMount() {
    this._mounted = true;
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  shouldComponentUpdate(nextProps) {
    const {sessions} = nextProps;
    const selected = sessions.filter(s => s.selected);
    const isSelectedAll = sessions.length == selected.length;
    const isSelectedNone = selected.length == 0;

    return !this._mounted || isSelectedAll || isSelectedNone;
  }

  render() {
    return (
      <JqxGrid
        ref={'sessionGrid'}
        width={'100%'}
        height={'100%'}
        theme={'material'}
        source={new jqx.dataAdapter({
          localdata: this.props.sessions,
          datatype: 'array',
          datafields: [
            { name: 'id', type: 'int' },
            { name: 'start_date', type: 'string' },
            { name: 'end_date', type: 'string' },
            { name: 'count', type: 'int' },
            { name: 'selected', type: 'boolean' }
          ]
        })}
        columns={[
          { text: 'ID', datafield: 'id', cellsalign: 'center', align: 'center', editable: false, width: '10%' },
          { text: 'Start Date', datafield: 'start_date', cellsalign: 'center', align: 'center', editable: false, width: '35%' },
          { text: 'End Date', datafield: 'end_date', align: 'center', cellsalign: 'center', editable: false, width: '35%' },
          { text: 'Count', datafield: 'count', cellsalign: 'center', align: 'center', editable: false, width: '15%' },
          { text: '✔', datafield: 'selected', columntype: 'checkbox', cellsalign: 'center', align: 'center', editable: true, width: '5%',
            cellvaluechanging: ((row) => {
              const rowdata = this.refs.sessionGrid.getrowdata(row);
              this.props.selectSession(rowdata.id);
            }).bind(this)
          },
        ]}
        rowsheight={30}
        columnsheight={25}
        pageable={false}
        sortable={true}
        altrows={true}
        editable={true}
      />
    );
  }
}

function LoadDatabaseFactory(PanelHeaderAction) {
  class LoadDatabase extends Component {
    static propTypes = {
      setDatasetLabel: PropTypes.func.isRequired,
      setQuery: PropTypes.func.isRequired,
      loadSession: PropTypes.func.isRequired,
      selectSession: PropTypes.func.isRequired,
      datasetLabel: PropTypes.string.isRequired,
      labelError: PropTypes.string,
      query: PropTypes.string.isRequired,
      queryError: PropTypes.string,
      isLoadingSession: PropTypes.bool.isRequired,
      isTestingQuery: PropTypes.bool.isRequired,
      isAvailableSessionId: PropTypes.bool.isRequired,
      sessions: PropTypes.array.isRequired,
    };

    static defaultProps = {
      updating: false,
    };

    _onConfirmButtonClick() {
      if (this.props.updating) {
        this.props.updateDataset();
      }
      else {
        this.props.addDataset();
      }
    }

    render() {
      const {
        isLoadingSession,
        isTestingQuery,
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
          <StyledDBSection>
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
          </StyledDBSection>
          <StyledDBSection>
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
              {isTestingQuery ? <LoadingDialog size="64" height="25vh" /> : (
                <StyledTextArea rows="10" height="25vh" onChange={e => this.props.setQuery(e.target.value)} value={query} />
              )}
              {queryError && (
                <StyledErrorMessage>
                  {queryError}
                </StyledErrorMessage>
              )}
            </div>
          </StyledDBSection>
          {
            isAvailableSessionId && !queryError && !queryTestError && (
              <StyledDBSection>
                <div className="description">
                  <div className="title">
                    <StyledSection width="50%">
                      <FormattedMessage id={'modal.loadDatabase.sessionTitle'} />
                    </StyledSection>
                    <SessionSection>
                      {isLoadingSession == false ? (
                        <>
                          <PanelHeaderAction
                            tooltip={'tooltip.reloadSession'}
                            IconComponent={Reload}
                            onClick={() => this.props.loadSession()}
                            className={'session-action'}
                          />
                          <PanelHeaderAction
                            tooltip={'tooltip.selectAll'}
                            IconComponent={Select}
                            onClick={() => {
                              this.props.selectSession('all')
                            }}
                          />
                           <PanelHeaderAction
                            tooltip={'tooltip.unselectAll'}
                            IconComponent={Delete}
                            onClick={() => {
                              this.props.selectSession('none')
                            }}
                          />
                        </>
                      ) : null}
                      
                    </SessionSection>
                  </div>
                  <div className="subtitle">
                    <FormattedMessage id={'modal.loadDatabase.sessionSubtitle'} />
                  </div>
                </div>
                <div className="selection">
                  {isLoadingSession ? <LoadingDialog size="64" height="25vh" /> : (
                    <div style={{ height: '25vh', width: '100%' }}>
                      <SessionGrid sessions={sessions} selectSession={this.props.selectSession} />
                    </div>
                  )}
                </div>
              </StyledDBSection>
            )
          }
          <StyledModalFooter>
            <FooterActionWrapper>
              <Button className="modal--footer--cancel-button" link onClick={this.props.onClose}>
                <FormattedMessage id={'modal.button.defaultCancel'} />
              </Button>
              <Button 
                className="modal--footer--confirm-button" 
                onClick={this._onConfirmButtonClick.bind(this)} 
              >
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
