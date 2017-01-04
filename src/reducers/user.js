import {
  handleActions,
} from 'redux-actions'

const state = {
  user: null,
}

export default handleActions({
  SET_USER: state => ({
    ...state,
  }),
}, state)
