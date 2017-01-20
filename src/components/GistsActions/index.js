import React, { Component } from 'react'

import { connect } from 'react-redux'

import { getActiveTab } from 'reducers/editor'
import { isLoading } from 'reducers/loaders'

import { createGist } from 'actions/gists'

import Button from 'components/Button'
import { Tabs, Tab } from 'components/Tabs'

import './style.scss'

@connect(state => ({
  gistID: state.gist.get('id'),
  isSavingGist: isLoading(state, 'SAVE_CURRENT_TO_GIST'),
  tab: getActiveTab(state),
  profile: state.user.get('profile'),
}), {
  createGist,
})
class GistsActions extends Component {

  handleCreateGist = () => {
    this.props.createGist()
  }

  render () {

    const {
      gistID,
      profile,
    } = this.props

    const hasGist = gistID
    const isLogged = profile

    return (
      <div className="GistsActions">
        <Tabs>
          { !hasGist &&
            <Tab
              onClick={this.handleCreateGist}
              float={true}
              remove={false}
              text={true}
            >
              Create gist
            </Tab> }
          { hasGist &&
            isLogged && [
            <Tab
              key="save"
              float={true}
              remove={false}
              text={true}
            >
              Save gist
            </Tab>,
            <Tab
              key="fork"
              float={true}
              remove={false}
              text={true}
            >
              Fork gist
            </Tab>
          ] }
        </Tabs>
      </div>
    )
  }

}

export default GistsActions
