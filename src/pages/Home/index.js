import React, { Component, PropTypes } from 'react'

import { loadGist } from 'actions/gists'

import Auth from 'components/Auth'
import Editor from 'components/Editor'
import Menu from 'components/Menu'
import Notifications from 'components/Notifications'

import IconMjml from 'icons/Mjml'

import './styles.scss'

class Home extends Component {

  static contextTypes = {
    socket: PropTypes.object,
  }

  static load = ({ dispatch, params }) => {
    if (params.gistID) {
      return dispatch(loadGist(params.gistID))
    }
  }

  componentDidMount () {
    const {
      socket,
    } = this.context

    socket.on('URL_CHANGE', ({ type, url }) => {
      switch (type) {
        case 'replace':
          history.replaceState({}, '', url)

          break
      }
    })
  }

  render () {
    return (
      <div className="Home">

        <Notifications />

        <div className="Application-Header">
          <div className="Application-Header-Logo">
            <IconMjml />
          </div>
          <Menu />
          <Auth />
        </div>

        <Editor />

      </div>
    )
  }

}

export default Home
