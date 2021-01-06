import React, { useState } from 'react';
import styled from 'styled-components';

import { Save2, Add, Play, Spinner } from 'components/common/icons';
import { FormattedMessage } from 'localization';
import {
  Button,
  PanelLabel,
  SidePanelSection,
  StyledPanelHeader,
  InlineInput
} from 'components/common/styled-components';
import PanelHeaderActionFactory from 'components/side-panel/panel-header-action';
import { Trash } from 'components/common/icons';

const PanelWrapper = styled.div`
  font-size: 12px;
  border-radius: 1px;
  margin-bottom: 8px;
  z-index: 1000;

  &.dragging {
    cursor: move;
  }
`;

const StyledProfilePanelHeader = styled(StyledPanelHeader)`
  height: ${props => props.theme.profilePanelHeaderHeight}px;
  .profile__remove-profile {
    opacity: 0;
  }
  .profile__removing-profile {
    opacity: 1;
  }
  border-left: ${props => props.selected ? 3 : 0}px solid ${props => props.theme.activeColor};
  :hover {
    cursor: pointer;
    background-color: ${props => props.theme.panelBackgroundHover};

    .profile__drag-handle {
      opacity: 1;
    }

    .profile__remove-profile {
      opacity: 1;
    }
  }
`;

const HeaderLabelSection = styled.div`
  display: flex;
  color: ${props => props.theme.textColor};
`;

const HeaderActionSection = styled.div`
  display: flex;
`;

export const ProfileLabelEditor = ({ profileId, label, onEdit }) => {
  const [value, setValue] = useState(label);
  const [isEditing, setEditing] = useState(false);

  return (
    <>
      {isEditing || (
        <div
          style={{ maxWidth: '185px', minWidth: '185px' }}
          onClick={e => {
            e.stopPropagation();
            setEditing(true);
          }}
        >
          {value}
        </div>
      )}
      {isEditing && (
        <InlineInput
          type="text"
          className="profile__title__editor"
          value={value}
          onClick={e => {
            e.stopPropagation();
          }}
          style={{fontSize: '12px'}}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.KeyCode === 13) {
              onEdit(value);
              setEditing(false);
            }
          }}
          id={`${profileId}:input-profile-label`}
        />
      )}
    </>
  );
};

export function ProfileTitleSectionFactory() {
  const StyledProfileTitleSection = styled.div`
    margin-left: 12px;

    .profile__title__type {
      color: ${props => props.theme.subtextColor};
      font-size: 10px;
      line-height: 12px;
      letter-spacing: 0.37px;
      text-transform: capitalize;
    }
  `;
  const ProfileTitleSection = ({ profileId, label, onUpdateProfileLabel }) => (
    <StyledProfileTitleSection className="profile__title">
      <div>
        <ProfileLabelEditor profileId={profileId} label={label} onEdit={onUpdateProfileLabel} />
      </div>
    </StyledProfileTitleSection>
  );
  return ProfileTitleSection;
}

MapProfileSelectorFactory.deps = [ProfileTitleSectionFactory, PanelHeaderActionFactory]

const defaultActionIcons = {
  remove: Trash,
  apply: Play,
  spinner: Spinner
};

function MapProfileSelectorFactory(ProfileTitleSection, PanelHeaderAction) {
  const MapProfileSelector = ({
    mapProfile,
    saveProfile,
    updateProfile,
    applyProfile,
    removeProfile,
    updateProfileLabel,
    actionIcons = defaultActionIcons
  }) => {
    const { profiles, isLoading, isSaving, isUpdating, selectedId } = mapProfile;
    const { isRemoving } = profiles.reduce((acc, profile) => ({ isRemoving: acc.isRemoving || profile.isRemoving }), { isRemoving: false });
    const btnDisabled = isLoading || isSaving || isUpdating || isRemoving;

    return (
      <div>
        <PanelLabel>
          <FormattedMessage id={'mapManager.mapProfile'} />
        </PanelLabel>
        {profiles.map(profile => (
          <PanelWrapper key={profile.id}>
            <StyledProfilePanelHeader selected={profile.id == selectedId}>
              <HeaderLabelSection className="profile-panel__header__content">
                <ProfileTitleSection
                  profileId={profile.id}
                  label={profile.label}
                  onUpdateProfileLabel={label => updateProfileLabel(profile.id, label)}
                />
              </HeaderLabelSection>
              <HeaderActionSection className="profile-panel__header__actions">
                <PanelHeaderAction
                  className={profile.isRemoving ? "profile__removing-profile" : "profile__remove-profile"}
                  id={profile.id}
                  tooltip={'tooltip.removeProfile'}
                  onClick={() => removeProfile(profile.id)}
                  tooltipType="error"
                  IconComponent={profile.isRemoving ? actionIcons.spinner : actionIcons.remove}
                />
                <PanelHeaderAction
                  className="profile__apply-profile"
                  id={profile.id}
                  tooltip={'tooltip.applyProfile'}
                  onClick={() => applyProfile(profile.id)}
                  IconComponent={profile.isApplying ? actionIcons.spinner : actionIcons.apply}
                />
              </HeaderActionSection>
            </StyledProfilePanelHeader>
          </PanelWrapper>
        ))}
        <SidePanelSection>
          <Button
            className="save-map-profile-button"
            style={{ width: '45%', marginRight: '10%' }}
            onClick={() => saveProfile()}
            disabled={btnDisabled}
            primary
          >
            {isLoading || isSaving ? <Spinner type="ls" /> : <Add height="12px" />}
            <FormattedMessage id={'mapManager.saveMapProfile'} />
          </Button>
          <Button
            disabled={selectedId == null || btnDisabled}
            className="update-map-profile-button"
            style={{ width: '45%' }}
            onClick={() => updateProfile()}
            secondary
          >
            {isUpdating ? <Spinner type="ls" /> : <Save2 height="12px" />}
            <FormattedMessage id={'mapManager.updateMapProfile'} />
          </Button>

        </SidePanelSection>
      </div>
    )
  };

  return MapProfileSelector;
}

export default MapProfileSelectorFactory;