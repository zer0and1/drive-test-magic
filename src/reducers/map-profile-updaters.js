export const INITIAL_VIS_STATE = {
  // profiles
  isLoading: false,
  isSaving: false,
  isUpdating: false,
  selectedId: null,
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

export const setUpdatingUpdater = (state, { value }) => {
  return {
    ...state,
    isUpdating: value
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
    }),
    selectedId: action.id
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

export const updateProfileUpdater = (state, { profile }) => {
  return {
    ...state,
    profiles: state.profiles.map(p => p.id == profile.id ? profile : p),
    isUpdating: false
  }
};

export const removeProfileUpdater = (state, { id }) => {
  const { profiles } = state;

  return {
    ...state,
    profiles: profiles.filter(profile => profile.id !== id),
    selectedId: state.selectedId == id ? null : state.selectedId
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
