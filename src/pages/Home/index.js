import React, { Component, PropTypes } from 'react'

import { connect } from 'react-redux'

import { addTab, removeActiveTab } from 'actions/editor'
import { getRateLimit } from 'actions/ratelimit'
import { loadGist, saveCurrentTabToGist } from 'actions/gists'
import { openModal } from 'actions/modals'

import Auth from 'components/Auth'
import Editor from 'components/Editor'
import Menu from 'components/Menu'
import Notifications from 'components/Notifications'
import RateLimit from 'components/RateLimit'

import IconMjml from 'icons/Mjml'

import './styles.scss'

@connect(({ editor }) => ({
  activeTab: editor.get('activeTab'),
}), {
  addTab,
  openModal,
  removeActiveTab,
  saveCurrentTabToGist,
})
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

    document.addEventListener('keydown', this.handleKeydown)
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.handleKeydown)
  }

  handleKeydown = e => {
    const {
      activeTab,
      addTab,
      openModal,
      removeActiveTab,
      saveCurrentTabToGist,
    } = this.props

    switch (true) {
      case (e.ctrlKey && e.altKey && e.keyCode === 78): // ctrl+alt+n
        addTab()
        break

      case (activeTab && e.ctrlKey && e.altKey && e.keyCode === 87): // ctrl+alt+w
        removeActiveTab()
        break

      case (e.ctrlKey && e.altKey && e.keyCode === 79): // ctrl+alt+o
        openModal('OPEN_FILE')
        break

      case (activeTab && e.ctrlKey && e.altKey && e.keyCode === 83): // ctrl+alt+s
        saveCurrentTabToGist()
        break
    }
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
