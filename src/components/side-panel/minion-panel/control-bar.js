import React, { Component } from 'react';
import { Select, Expand, Collapse, Small, Medium, Large } from 'components/common/icons';
import PanelHeaderActionFactory from 'components/side-panel/panel-header-action';

import PropTypes from 'prop-types';
import classnames from 'classnames';
import styled from 'styled-components';
import { FormattedMessage } from 'localization';
import { Tooltip } from 'components/common/styled-components';

const StyledControlBarWrapper = styled.div`
  float: right;
  margin-top: 5px;
`;

const ControlButtonWrapper = styled.div`
  margin-right: ${props => props.marginRight}px;
  float: left;
  color: ${props => props.active ? props.theme.activeColor : props.theme.panelHeaderIcon};
  stroke: ${props => props.active ? props.theme.activeColor : props.theme.panelHeaderIcon};
  font-family: ${props => props.theme.fontFamily};
  
  :hover {
    cursor: pointer;
    color: ${props => props.active ? props.theme.activeColor : props.theme.activeColorHover};
    stroke: ${props => props.active ? props.theme.activeColor : props.theme.activeColorHover};
  }

  &.disabled {
    pointer-events: none;
    opacity: 0.3;
  }
`;

const ControlButton = ({ onClick, IconComponent, marginRight, active, tooltip, id }) => (
  <ControlButtonWrapper marginRight={marginRight} onClick={onClick} active={active}>
    <IconComponent
      height="24px"
      data-tip
      data-for={`${tooltip}_${id}`}
    />
    {tooltip ? (
      <Tooltip id={`${tooltip}_${id}`} effect="solid" delayShow={500}>
        <span>
          <FormattedMessage id={tooltip} />
        </span>
      </Tooltip>
    ) : null}
  </ControlButtonWrapper>
);

ControlBarFactory.deps = [];

function ControlBarFactory() {
  const ControlBar = ({ selectAll, expand, collapse, setMarkerScale, markerScale, selectedAll }) => (
    <StyledControlBarWrapper>
      <ControlButton
        onClick={() => selectAll(!selectedAll)}
        tooltip={'tooltip.selectAll'}
        IconComponent={Select}
        marginRight={50}
      />
      <ControlButton
        onClick={expand}
        tooltip={'tooltip.zoomToAll'}
        IconComponent={Expand}
      />
      <ControlButton
        onClick={collapse}
        tooltip={'tooltip.centerToSelected'}
        IconComponent={Collapse}
        marginRight={50}
      />
      <ControlButton
        onClick={() => setMarkerScale('small')}
        tooltip={'tooltip.smallMarker'}
        IconComponent={Small}
        marginRight={5}
        active={markerScale == 'small'}
      />
      <ControlButton
        onClick={() => setMarkerScale('medium')}
        tooltip={'tooltip.mediumMarker'}
        IconComponent={Medium}
        marginRight={5}
        active={markerScale == 'medium'}
      />
      <ControlButton
        onClick={() => setMarkerScale('large')}
        tooltip={'tooltip.largeMarker'}
        IconComponent={Large}
        active={markerScale == 'large'}
      />
    </StyledControlBarWrapper>
  );

  return ControlBar;
}

export default ControlBarFactory;