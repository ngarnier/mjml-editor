import React, { Component } from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import getGistID from 'helpers/getGistID'

import { loadGist } from 'actions/gists'

import { isLoading } from 'reducers/loaders'

import Input from 'components/Input'
import Modal from 'components/Modal'
import Button from 'components/Button'

import './styles.scss'

@connect(state => ({
  isLoadingGist: isLoading(state, 'LOAD_GIST'),
}), dispatch => ({

  // bind raw actions with dispatch
  ...bindActionCreators({

    // load a gist
    loadGist,

  }, dispatch),

}))
class Menu extends Component {

  state = {
    gistValue: '',
    isModalOpenOpened: false,
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.isLoadingGist === true &&
        nextProps.isLoadingGist === false) {
      this.setState({
        gistValue: '',
        isModalOpenOpened: false,
      })
    }
  }

  componentDidUpdate () {
    if (this.state.isModalOpenOpened && this.input) {
      this.input.focus()
    }
  }

  handleChangeGist = value => this.setState({
    gistValue: value,
  })

  toggleModalOpen = () => this.setState(prev => ({
    isModalOpenOpened: !prev.isModalOpenOpened,
  }))

  closeModalOpen = () => this.setState({
    isModalOpenOpened: false,
  })

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

  render () {
    const {
      isLoadingGist,
    } = this.props

    const {
      isModalOpenOpened,
      gistValue,
    } = this.state

    return (
      <div className="Menu">
        <div
          className="Menu-Item"
          onClick={this.toggleModalOpen}
        >
          Open gist
        </div>

        <Modal
          onClose={this.closeModalOpen}
          isOpened={isModalOpenOpened}
        >
          <form
            className="OpenGist"
            onSubmit={this.openGist}
          >
            <Input
              onChange={this.handleChangeGist}
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
