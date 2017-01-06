import { handleActions } from 'redux-actions'
import shortid from 'shortid'
import { fromJS } from 'immutable'

const state = fromJS({
  activeTab: null,
  tabs: [],
})

function getActiveIndex (state) {
  return state.get('tabs').findIndex(
    item => item.get('id') === state.get('activeTab')
  )
}

export default handleActions({

  SET_ACTIVE_TAB: (state, { payload: id }) => state.set('activeTab', id),
  SET_TABS: (state, { payload }) => state.set('tabs', payload),

  ADD_TAB: (state) => {

    const tabs = state.get('tabs')
    const activeIndex = getActiveIndex(state)

    const tab = fromJS({
      id: shortid.generate(),
      name: 'untitled',
      value: '',
    })

    return state
      .set('tabs', tabs.insert(activeIndex + 1, tab))
      .set('activeTab', tab.get('id'))

  },

  REMOVE_TAB: (state, { payload: id }) => {

    let newState = state

    const tabs = state.get('tabs')
    const index = tabs.findIndex(item => item.get('id') === id)
    const newTabs = tabs.remove(index)

    newState = newState.set('tabs', newTabs)

    if (state.get('activeTab') === id) {

      const newActiveTab = newTabs.size > 0
        ? index - 1 < 0
          ? newTabs.getIn([0, 'id'])
          : newTabs.getIn([index - 1, 'id'])
        : null

      newState = newState.set('activeTab', newActiveTab)

    }

    return newState

  },

  SET_CURRENT_VALUE: (state, { payload: mjml }) => state
    .update('tabs', tabs => tabs.setIn(
      [
        tabs.findIndex(t => t.get('id') === state.get('currentTab')),
        'value',
      ],
      mjml,
    )),

  SET_GIST_ID: (state, { payload: { id, gistID } }) => state
    .update('tabs', tabs => tabs.setIn(
      [
        tabs.findIndex(t => t.get('id') === id),
        'gistID',
      ],
      gistID,
    )),

}, state)

export function getActiveTab (state) {
  const tabs = state.editor.get('tabs')
  const activeTab = state.editor.get('activeTab')
  return tabs.find(t => t.get('id') === activeTab, null)
}
