import React, { Component } from 'react'
import { connect } from 'react-redux'

import saveCurrentTabToGist from 'actions/saveCurrentTabToGist'

import Button from 'components/Button'

import './style.scss'

@connect(state => {
  const tabs = state.editor.get('tabs')
  const activeTab = state.editor.get('activeTab')
  return {
    tab: tabs.find(t => t.get('id') === activeTab),
  }
}, {
  saveCurrentTabToGist,
})
class TabActions extends Component {

  render () {

    const {
      saveCurrentTabToGist,
      tab,
    } = this.props

    const gistID = tab.get('gistID')

    return (
      <div className="TabActions">
        <div className="horizontal-list">
          <Button
            success
            onClick={saveCurrentTabToGist}
          >
            {'save'}
          </Button>

          {gistID && (
            <div>
              {`Gist ID: ${gistID}`}
            </div>
          )}
        </div>
      </div>
    )
  }

}

export default TabActions
