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
  isMenuOpen: isModalOpen(state, 'OPEN_FILE'),
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
      isMenuOpen,
    } = this.props

    if (isLoadingGist && !nextProps.isLoadingGist) {
      closeModal('OPEN_FILE')
    }

    if (isMenuOpen && !nextProps.isMenuOpen) {
      this.setState({
        gistValue: '',
      })
    }
  }

  componentDidUpdate () {
    const {
      isMenuOpen,
    } = this.props

    if (isMenuOpen && this.input) {
      this.input.focus()
    }
  }

  toggleModalOpen = () => {
    const {
      isMenuOpen,
      closeModal,
      openModal,
    } = this.props

    if (isMenuOpen) {
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
      isMenuOpen,
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
          onClick={this.toggleModalOpen}
        >
          Open gist
        </div>

        <Modal
          onClose={this.toggleModalOpen}
          isOpened={isMenuOpen}
        >
          <form
            className="OpenGist"
            onSubmit={this.openGist}
          >
            <Input
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
