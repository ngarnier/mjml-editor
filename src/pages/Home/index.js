import React, { Component, PropTypes } from 'react'

import { loadGist } from 'actions/gists'
import { getRateLimit } from 'actions/ratelimit'

import Auth from 'components/Auth'
import Editor from 'components/Editor'
import Menu from 'components/Menu'
import Notifications from 'components/Notifications'
import RateLimit from 'components/RateLimit'

import IconMjml from 'icons/Mjml'

import './styles.scss'

class Home extends Component {

  static contextTypes = {
    socket: PropTypes.object,
  }

  static load = ({ dispatch, params }) => {
    const promises = []

    if (params.gistID) {
      promises.push(dispatch(loadGist(params.gistID)))
    }

    promises.push(dispatch(getRateLimit()))

    return Promise.all(promises)
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
          <RateLimit />
          <Auth />
        </div>

        <Editor />

      </div>
    )
  }

}

export default Home
