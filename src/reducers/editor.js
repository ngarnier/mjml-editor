import {
  handleActions,
} from 'redux-actions'

const state = {
  activeTab: null,
  tabs: [],
}

export default handleActions({
  SET_ACTIVE_TAB: (state, { payload }) => ({
    ...state,
    activeTab: payload,
  }),
  SET_TABS: (state, { payload }) => ({
    ...state,
    tabs: payload,
  }),
}, state)
