import React, { Component } from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import getGistID from 'helpers/getGistID'

import { loadGist, newGist } from 'actions/gists'
import { openModal, closeModal } from 'actions/modals'

import { isLoading } from 'reducers/loaders'
import { isModalOpen } from 'reducers/modals'

import Input from 'components/Input'
import Modal from 'components/Modal'
import Button from 'components/Button'

import './styles.scss'

@connect(state => ({
  isLoadingGist: isLoading(state, 'LOAD_GIST'),
  isModalOpenFileOpen: isModalOpen(state, 'OPEN_FILE'),
}), dispatch => ({

  // bind raw actions with dispatch
  ...bindActionCreators({

    // load a gist
    loadGist,

    // new gist
    newGist,

    openModal,
    closeModal,

  }, dispatch),

}))
class Menu extends Component {

  state = {
    gistValue: '',
  }

  componentWillReceiveProps (nextProps) {
    const {
      closeModal,
      isLoadingGist,
      isModalOpenFileOpen,
    } = this.props

    if (isLoadingGist && !nextProps.isLoadingGist) {
      closeModal('OPEN_FILE')
    }

    if (isModalOpenFileOpen && !nextProps.isModalOpenFileOpen) {
      this.setState({
        gistValue: '',
      })
    }
  }

  componentDidUpdate () {
    const {
      isModalOpenFileOpen,
    } = this.props

    if (isModalOpenFileOpen && this.input) {
      this.input.focus()
    }
  }

  toggleModalNewGist = () => {
    const {
      isModalOpenFileOpen,
      closeModal,
      openModal,
    } = this.props

    if (isModalOpenFileOpen) {
      closeModal('OPEN_FILE')
    } else {
      openModal('OPEN_FILE')
    }
  }

  openGist = e => {
    const {
      loadGist,
    } = this.props

    const {
      gistValue,
    } = this.state

    if (e) { e.preventDefault() }

    const gistID = getGistID(gistValue)

    if (gistID) {
      loadGist(gistID)
    }
  }

  handleChangeInputGist = value => this.setState({
    gistValue: value,
  })

  handleClickNewGist = () => this.props.newGist()

  render () {
    const {
      isLoadingGist,
      isModalOpenFileOpen,
    } = this.props

    const {
      gistValue,
    } = this.state

    return (
      <div className="Menu">
        <div
          className="Menu-Item"
          onClick={this.handleClickNewGist}
        >
          New gist
        </div>
        <div
          className="Menu-Item"
          onClick={this.toggleModalNewGist}
        >
          Open gist
        </div>

        <Modal
          onClose={this.toggleModalNewGist}
          isOpened={isModalOpenFileOpen}
        >
          <form
            className="horizontal-list"
            onSubmit={this.openGist}
          >
            <Input
              className="flex-1"
              onChange={this.handleChangeInputGist}
              placeholder="Gist id or gist url"
              ref={r => this.input = r}
              value={gistValue}
            />
            <div>
              <Button
                onClick={this.openGist}
                isLoading={isLoadingGist}
              >
                Open
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    )
  }

}

export default Menu
