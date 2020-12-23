export const INITIAL_VIS_STATE = {
  // profiles
  isLoading: false,
  isSaving: false,
  profiles: []
};

export const setLoadingUpdater = (state, { value }) => {
  return {
    ...state,
    isLoading: value
  };
}

export const setSavingUpdater = (state, { value }) => {
  return {
    ...state,
    isSaving: value
  };
}

export const setRemovingUpdater = (state, { action }) => {
  return {
    ...state,
    profiles: state.profiles.map(profile => {
      if (profile.id === action.id) {
        return {
          ...profile,
          isRemoving: action.value
        };
      }
      return profile;
    })
  };
}

export const setApplyingUpdater = (state, { action }) => {
  return {
    ...state,
    profiles: state.profiles.map(profile => {
      if (profile.id === action.id) {
        return {
          ...profile,
          isApplying: action.value
        };
      }
      return profile;
    })
  };
}

export const loadProfileUpdater = (state, { profiles }) => {
  return {
    ...state,
    profiles,
    isLoading: false
  };
}

export const saveProfileUpdater = (state, { newProfile }) => {
  return {
    ...state,
    profiles: [
      ...state.profiles,
      newProfile
    ],
    isSaving: false
  }
};

export const removeProfileUpdater = (state, { id }) => {
  const { profiles } = state;

  return {
    ...state,
    profiles: profiles.filter(profile => profile.id !== id)
  };
};

export const updateProfileLabelUpdater = (state, { action }) => {
  const { profiles } = state;

  return {
    ...state,
    profiles: profiles.map(profile => {
      if (profile.id === action.id) {
        return {
          ...profile,
          label: action.label
        };
      }
      return profile;
    })
  };
};
