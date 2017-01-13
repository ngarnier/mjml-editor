import React, { Component } from 'react'
import { connect } from 'react-redux'

import './styles.scss'

import { getActiveTab } from 'reducers/editor'

import GistPanelFile from './GistPanelFile'

@connect(state => ({
  gist: state.gist,
  activeTab: getActiveTab(state),
}))
class GistPanel extends Component {

  render () {

    const {
      gist,
      activeTab,
    } = this.props

    const activeTabName = activeTab
      ? activeTab.get('name')
      : null

    return (
      <div className="GistPanel">
        {gist.get('files').map(file => (
          <GistPanelFile
            key={file.get('filename')}
            file={file}
            activeTabName={activeTabName}
          />
        ))}
      </div>
    )
  }

}

export default GistPanel
