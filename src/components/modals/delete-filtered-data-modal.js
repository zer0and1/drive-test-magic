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

import React, { useState } from 'react';
import styled from 'styled-components';
import DatasetLabel from 'components/common/dataset-label';
import { FormattedMessage } from 'localization';
import LoadingDialog from './loading-dialog';
import { media } from 'styles/media-breakpoints';
import { Button } from 'components/common/styled-components';

const StyledMsg = styled.div`
  margin-top: 24px;
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

export const DeleteFilteredDataModal = ({ dataset, onCancel, onDelete, filters, removeFilter }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const _onDelete = () => {
    setIsDeleting(true);
    onDelete();
    // filters.forEach((f, idx) => removeFilter(idx));
  };

  return (
    <div className="delete-dataset-modal">
      {isDeleting ? (
        <LoadingDialog size="64" height="150px" />
      ) : (
        <>
          <DatasetLabel dataset={dataset} />
          <StyledMsg className="delete-dataset-msg">
            <FormattedMessage
              id={'modal.deleteFilteredData.warning'}
              values={{ length: dataset.filteredIndexForDomain.length }}
            />
          </StyledMsg>
          <StyledModalFooter>
            <FooterActionWrapper>
              <Button className="modal--footer--cancel-button" link onClick={onCancel}>
                <FormattedMessage id={'modal.button.defaultCancel'} />
              </Button>
              <Button className="modal--footer--confirm-button" onClick={_onDelete} negative large>
                <FormattedMessage id={'modal.button.delete'} />
              </Button>
            </FooterActionWrapper>
          </StyledModalFooter>
        </>
      )}
    </div>
  );
};

const DeleteFilteredDataModalFactory = () => DeleteFilteredDataModal;
export default DeleteFilteredDataModalFactory;
