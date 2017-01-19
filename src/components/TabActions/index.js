import React, { Component } from 'react'

import { connect } from 'react-redux'

import { getActiveTab } from 'reducers/editor'
import { isLoading } from 'reducers/loaders'

import { saveCurrentTabToGist, removeFileFromGist } from 'actions/gists'

import Button from 'components/Button'

import './style.scss'

@connect(state => ({
  gistID: state.gist.get('id'),
  isSavingGist: isLoading(state, 'SAVE_CURRENT_TO_GIST'),
  tab: getActiveTab(state),
  profile: state.user.get('profile'),
}), {
  saveCurrentTabToGist,
  removeFileFromGist,
})
class TabActions extends Component {

  render () {

    const {
      disabledSave,
      gistID,
      isSavingGist,
      profile,
      saveCurrentTabToGist,
    } = this.props

    return (
      <div className="TabActions">

        <div className="horizontal-list">

          <Button
            disabled={disabledSave}
            isLoading={isSavingGist}
            onClick={saveCurrentTabToGist}
            success={!disabledSave}
          >
            { gistID
              ? profile
                ? 'Save'
                : 'Fork'
              : 'Create gist' }
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
