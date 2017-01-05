import React, {
  Component,
} from 'react'

import io from 'socket.io-client'

import Empty from 'components/Empty'
import Footer from 'components/Footer'

import IconHtml from 'icons/Html'
import IconWindowMaximize from 'icons/WindowMaximize'
import IconWindowMinimize from 'icons/WindowMinimize'

import './styles.scss'

class Iframe extends Component {

  state = {
    preview: {
      html: '',
    },
  }

  componentDidMount () {
    const {
      minimize,
    } = this.props

    this.socket = io.connect()

    this.socket.emit('event', 'send-html-to-preview')

    this.socket.on('preview-html', ({ preview }) => {
      if (this.iframe) {
        this.setHTML(preview.html)

        this.setState({
          preview,
        })
      }
    })

    if (minimize) {
      window.addEventListener('beforeunload', () => {
        this.socket.emit('event', 'minimize-preview')
      })
    }
  }

  setHTML (html) {
    const doc = this.iframe.contentDocument
    const documentElement = doc.documentElement

    documentElement.innerHTML = html
  }

  handleClickMaximize = () => {
    const {
      onMaximize,
    } = this.props

    onMaximize()
  }

  handleClickMinimize = () => {
    window.close()
  }

  render () {
    const {
      maximize,
      minimize,
    } = this.props
    const {
      preview,
    } = this.state

    return (
      <div className="Iframe">
        { preview.html !== '' &&
          <div className="Iframe-Toolbar">
            { maximize &&
              <div
                className="Iframe-Toolbar-Button"
                onClick={this.handleClickMaximize}
              >
                <IconWindowMaximize />
              </div> }
            { minimize &&
              <div
                className="Iframe-Toolbar-Button"
                onClick={this.handleClickMinimize}
              >
                <IconWindowMinimize />
              </div> }
          </div> }
        <div className="Iframe-Content">
          <iframe
            ref={r => this.iframe = r}
            style={{
              display: preview.html !== ''
                ? 'block'
                : 'none',
            }}
          />
          { preview.html === '' &&
            <Empty>
              <IconHtml />
              ಠ_ಠ
            </Empty> }
        </div>
        { preview.html !== '' &&
          <Footer
            align="right"
            items={[
              `Html size: ${preview.size}`,
              `Time for render: ${preview.executionTime}ms`,
              `Last render: ${new Date(preview.lastRender)}`,
            ]}
          /> }
      </div>
    )
  }

}

export default Iframe
