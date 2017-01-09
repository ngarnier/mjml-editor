import React, { Component } from 'react'
import { connect } from 'react-redux'

import { getActiveTab } from 'reducers/editor'
import { isLoading } from 'reducers/loaders'

import {
  saveCurrentTabToGist,
  removeFileFromGist,
} from 'actions/gists'

import Button from 'components/Button'
import Modal from 'components/Modal'

import './style.scss'

@connect(state => ({
  tab: getActiveTab(state),
  isSavingGist: isLoading(state, 'SAVE_CURRENT_TO_GIST'),
  isDeletingGist: isLoading(state, 'REMOVE_FILE_FROM_GIST'),
}), {
  saveCurrentTabToGist,
  removeFileFromGist,
})
class TabActions extends Component {

  state = {
    isModalDeleteOpened: false,
  }

  openModalDelete = () => this.setState({ isModalDeleteOpened: true })
  closeModalDelete = () => this.setState({ isModalDeleteOpened: false })

  removeFile = () => {

    const {
      tab,
      removeFileFromGist,
    } = this.props

    this.closeModalDelete()
    removeFileFromGist(tab.get('name'))
  }

  render () {

    const {
      saveCurrentTabToGist,
      tab,
      isSavingGist,
      isDeletingGist,
    } = this.props

    const {
      isModalDeleteOpened,
    } = this.state

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

          <Button
            danger
            onClick={this.openModalDelete}
            isLoading={isDeletingGist}
          >
            {'delete'}
          </Button>

        </div>

        <Modal
          onClose={this.closeModalDelete}
          isOpened={isModalDeleteOpened}
        >
          <div style={{ marginBottom: 20 }}>
            {'Delete file?'}
          </div>
          <div className="horizontal-list">
            <Button onClick={this.removeFile}>
              {'YES'}
            </Button>
            <Button onClick={this.closeModalDelete}>
              {'NO'}
            </Button>
          </div>
        </Modal>

      </div>
    )
  }

}

export default TabActions
