import React, { Component, PropTypes } from 'react'

import Empty from 'components/Empty'
import Footer from 'components/Footer'

import IconHtml from 'icons/Html'
import IconWindowMaximize from 'icons/WindowMaximize'
import IconWindowMinimize from 'icons/WindowMinimize'

import './styles.scss'

class Iframe extends Component {

  static contextTypes = {
    socket: PropTypes.object,
  }

  state = {
    preview: {
      html: '',
    },
  }

  componentDidMount () {
    const {
      socket,
    } = this.context

    const {
      maximize,
      minimize,
    } = this.props

    if (minimize) {
      socket.emit('event', 'PING_EDITOR')
    }

    socket.emit('event', 'send-html-to-preview')

    socket.on('PONG_EDITOR', () => {
      setTimeout(() => socket.emit('event', 'PING_EDITOR'), 1e3)
    })

    socket.on('preview-html', ({ preview }) => {
      if (this.iframe) {
        this.setHTML(preview.html)

        this.setState({
          preview,
        })
      }
    })

    if (minimize) {
      window.addEventListener('beforeunload', () => {
        socket.emit('event', 'minimize-preview')
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
          <div className="sticky">

            <iframe
              ref={r => this.iframe = r}
              style={{
                display: preview.html !== ''
                  ? 'block'
                  : 'none',
              }}
            />

            {preview.html === '' && (
              <Empty>
                <IconHtml />
                ಠ_ಠ
              </Empty>
            )}

          </div>
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
