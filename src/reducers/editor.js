import { handleActions } from 'redux-actions'
import shortid from 'shortid'
import { fromJS } from 'immutable'

import defaultTemplate from 'data/defaultTemplate'

const MAX_SIZE = 70
const MIN_SIZE = 30

const initialState = fromJS({
  activeTab: null,
  tabs: [],

  // used to compute ratio between editor and preview (in %)
  // it can vary between 20 and 80
  editorSize: 50,
})

function getActiveIndex (state) {
  return state.get('tabs').findIndex(
    item => item.get('id') === state.get('activeTab')
  )
}

function removeTab (state, id) {
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
}

export default handleActions({

  SET_ACTIVE_TAB: (state, { payload: id }) => state.set('activeTab', id),
  SET_TABS: (state, { payload }) => state.set('tabs', payload),

  SET_EDITOR_SIZE: (state, { payload: percent }) => {
    if (percent > MAX_SIZE) {
      percent = MAX_SIZE
    }

    if (percent < MIN_SIZE) {
      percent = MIN_SIZE
    }

    return state.set('editorSize', percent)
  },

  ADD_TAB: (state, { payload: file }) => {

    const tabs = state.get('tabs')
    const activeIndex = getActiveIndex(state)

    // if file already open, just focus tab

    if (file) {
      const fileTab = tabs.find(t => t.get('name') === file.get('filename'))
      if (fileTab) {
        return state.set('activeTab', fileTab.get('id'))
      }
    }

    // limit to 5 tabs
    if (state.get('tabs').size === 5) { return state }

    const tab = fromJS({
      id: shortid.generate(),
      name: file ? file.get('filename') : 'untitled',
      value: file ? file.get('content') : defaultTemplate,
    })

    return state
      .set('tabs', tabs.insert(activeIndex + 1, tab))
      .set('activeTab', tab.get('id'))

  },

  REMOVE_TAB: (state, { payload: id }) => {

    return removeTab(state, id)

  },

  REMOVE_ACTIVE_TAB: state => {

    return removeTab(state, state.get('activeTab'))

  },

  SET_CURRENT_VALUE: (state, { payload: mjml }) => state
    .update('tabs', tabs => {
      const index = tabs.findIndex(t => t.get('id') === state.get('activeTab'))
      return tabs.setIn(
        [index, 'value'],
        mjml,
      )
    }),

  REMOVE_FILE_FROM_GIST_SUCCESS: (state, { payload }) => {

    const {
      name,
    } = payload.extra

    const tab = state.get('tabs').find(t => t.get('name') === name)
    if (!tab) { return state }

    const activeTab = state.get('activeTab')
    const isActive = tab.get('id') === activeTab

    return state
      .update(
        'tabs',
        tabs => tabs.filter(t => t.get('name') !== name)
      )
      .set('activeTab', isActive ? null : activeTab)
  },

  RENAME_FILE_SUCCESS: (state, { payload }) => {

    const {
      newName,
      oldName,
    } = payload.extra

    return state
      .update(
        'tabs',
        tabs => tabs.map(f => {
          if (f.get('name') === oldName) {
            return f.set('name', newName)
          }
          return f
        })
      )

  },

}, initialState)

export function getActiveTab (state) {
  const tabs = state.editor.get('tabs')
  const activeTab = state.editor.get('activeTab')
  return tabs.find(t => t.get('id') === activeTab, null)
}
