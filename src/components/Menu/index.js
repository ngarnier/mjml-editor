import React, {
  Component,
} from 'react'

import socket from 'helpers/getClientSocket'
import getGistID from 'helpers/getGistID'

import Input from 'components/Input'
import Modal from 'components/Modal'
import Button from 'components/Button'

import './styles.scss'

class Menu extends Component {

  state = {
    gistValue: '',
    isModalOpenOpened: false,
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
    isModalOpenOpened: !prev.isModalOpenOpened
  }))

  closeModalOpen = () => this.setState({
    isModalOpenOpened: false,
  })

  openGist = e => {
    const {
      gistValue,
    } = this.state

    if (e) { e.preventDefault() }

    const gistID = getGistID(gistValue)

    if (gistID) {
      socket.emit('gist-open', { gistID })
    }
  }

  render () {
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
              <Button onClick={this.openGist}>
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
