import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import {connect} from 'react-redux';

import {Save2, Add, Play, Spinner, Trash} from 'components/common/icons';
import {FormattedMessage} from 'localization';
import {
  Button,
  PanelLabel,
  SidePanelSection,
  StyledPanelHeader,
  TextArea,
} from 'components/common/styled-components';
import PanelHeaderActionFactory from 'components/side-panel/panel-header-action';
import {USER_ROLES} from '../../../constants/default-settings';

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
  height: fit-content;
  min-height: 48px;
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

const StyledTextArea = styled(TextArea)`
  white-space: pre-wrap;
  overflow-wrap: break-word;
  font-size: 12px;
  width: 190px;
  height: 40px;
`;

export const ProfileLabelEditor = ({ profileId, label, onEdit, readOnly }) => {
  const [value, setValue] = useState(label);
  const [isEditing, setEditing] = useState(false);
  const [isClicked, setClicked] = useState(false);

  useEffect(() => {
    if (isClicked) {
      document.getElementById(`${profileId}:input-profile-label`).focus();
      document.execCommand("selectall", null, false);
      setClicked(false);
    }
  });

  return (
    <>
      {isEditing || (
        <div
          style={{ maxWidth: '185px', minWidth: '185px' }}
          onClick={e => {
            e.stopPropagation();
            if (readOnly == false) {
              setEditing(true);
              setClicked(true);
            }
          }}
        >
          {value}
        </div>
      )}
      {isEditing && (
        <StyledTextArea
          type="text"
          className="profile__title__editor"
          value={value}
          rows="2"
          cols="25"
          onClick={e => {
            e.stopPropagation();
          }}
          onChange={(e) => readOnly || setValue(e.target.value)}
          onBlur={() => {
            onEdit(value);
            setEditing(false);
          }}
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.KeyCode === 13) && readOnly == false) {
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
  const ProfileTitleSection = ({ profileId, label, onUpdateProfileLabel, hadProfilePrivilege }) => (
    <StyledProfileTitleSection className="profile__title">
      <div>
        <ProfileLabelEditor profileId={profileId} label={label} onEdit={onUpdateProfileLabel} readOnly={!hadProfilePrivilege} />
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
    userRole,
    mapProfile,
    addProfile,
    updateProfile,
    applyProfile,
    removeProfile,
    updateProfileLabel,
    map,
    actionIcons = defaultActionIcons
  }) => {
    const { profiles, isLoading, isAdding, isUpdating, selectedId } = mapProfile;
    const { isRemoving } = profiles.reduce((acc, profile) => ({ isRemoving: acc.isRemoving || profile.isRemoving }), { isRemoving: false });
    const btnDisabled = isLoading || isAdding || isUpdating || isRemoving;
    const hadProfilePrivilege = userRole == USER_ROLES.admin || userRole == USER_ROLES.user;

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
                  hadProfilePrivilege={hadProfilePrivilege}
                  onUpdateProfileLabel={label => updateProfileLabel(profile.id, label)}
                />
              </HeaderLabelSection>
              <HeaderActionSection className="profile-panel__header__actions">
                {hadProfilePrivilege ? (
                  <PanelHeaderAction
                    className={profile.isRemoving ? "profile__removing-profile" : "profile__remove-profile"}
                    id={profile.id}
                    tooltip={'tooltip.removeProfile'}
                    onClick={() => removeProfile(profile.id)}
                    tooltipType="error"
                    IconComponent={profile.isRemoving ? actionIcons.spinner : actionIcons.remove}
                  />
                ) : null}
                <PanelHeaderAction
                  className="profile__apply-profile"
                  id={profile.id}
                  tooltip={'tooltip.applyProfile'}
                  onClick={() => applyProfile(profile.id, map)}
                  IconComponent={profile.isApplying ? actionIcons.spinner : actionIcons.apply}
                />
              </HeaderActionSection>
            </StyledProfilePanelHeader>
          </PanelWrapper>
        ))}
        {hadProfilePrivilege ? (
          <SidePanelSection>
            <Button
              className="save-map-profile-button"
              style={{ width: '30%', marginRight: '5%' }}
              onClick={() => addProfile(map)}
              disabled={btnDisabled}
              primary
            >
              {isAdding ? <Spinner type="ls" /> : <Add height="12px" />}
              <FormattedMessage id={'mapManager.saveMapProfile'} />
            </Button>
            <Button
              disabled={selectedId == null || btnDisabled}
              className="update-map-profile-button"
              style={{ width: '35%' }}
              onClick={() => updateProfile(map)}
              secondary
            >
              {isUpdating ? <Spinner type="ls" /> : <Save2 height="12px" />}
              <FormattedMessage id={'mapManager.updateMapProfile'} />
            </Button>

          </SidePanelSection>
        ) : null}
      </div>
    )
  };

  const mapStateToProps = state => state.main.keplerGl;

  return connect(mapStateToProps)(MapProfileSelector)
}

export default MapProfileSelectorFactory;