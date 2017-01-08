import React, { Component } from 'react'
import { connect } from 'react-redux'

import { getActiveTab } from 'reducers/editor'
import { isLoading } from 'reducers/loaders'

import { saveCurrentTabToGist } from 'actions/gists'

import Button from 'components/Button'

import './style.scss'

@connect(state => ({
  tab: getActiveTab(state),
  isSavingGist: isLoading(state, 'SAVE_CURRENT_TO_GIST'),
}), {
  saveCurrentTabToGist,
})
class TabActions extends Component {

  render () {

    const {
      saveCurrentTabToGist,
      tab,
      isSavingGist,
    } = this.props

    const gistID = tab.get('gistID')

    return (
      <div className="TabActions">

        <div className="horizontal-list">
          <Button
            success
            onClick={saveCurrentTabToGist}
            isLoading={isSavingGist}
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
