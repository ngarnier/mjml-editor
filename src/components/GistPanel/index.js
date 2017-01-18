import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
  getActiveTab,
} from 'reducers/editor'

import {
  removeFileFromGist,
} from 'actions/gists'

import Modal from 'components/Modal'
import Button from 'components/Button'

import GistPanelFile from './GistPanelFile'

import './styles.scss'

@connect(state => ({
  gist: state.gist,
  activeTab: getActiveTab(state),
}), {
  removeFileFromGist,
})
class GistPanel extends Component {

  state = {
    fileToDelete: null,
    isModalDeleteOpened: false,
  }

  openModalDelete = file => {
    this.setState({
      fileToDelete: file,
      isModalDeleteOpened: true,
    })
  }

  closeModalDelete = () => {
    this.setState({
      isModalDeleteOpened: false,
      fileToDelete: null,
    })
  }

  removeFile = () => {
    const {
      fileToDelete,
    } = this.state
    const {
      removeFileFromGist,
    } = this.props
    removeFileFromGist(fileToDelete.get('filename'))
    this.closeModalDelete()
  }

  render () {

    const {
      isModalDeleteOpened,
    } = this.state

    const {
      gist,
      activeTab,
    } = this.props

    const activeTabName = activeTab
      ? activeTab.get('name')
      : null

    return (
      <div className="GistPanel">
        {gist.get('files').map(file => (
          <GistPanelFile
            key={file.get('filename')}
            file={file}
            activeTabName={activeTabName}
            onDelete={this.openModalDelete}
          />
        ))}

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

export default GistPanel
