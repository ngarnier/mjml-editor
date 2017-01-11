import React, { Component } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'

import './styles.scss'

import { getActiveTab } from 'reducers/editor'

import { addTab } from 'actions/editor'

@connect(state => ({
  gist: state.gist,
  activeTab: getActiveTab(state),
}), {
  addTab,
})
class GistPanel extends Component {

  render () {

    const {
      gist,
      addTab,
      activeTab,
    } = this.props

    const activeTabName = activeTab
      ? activeTab.get('name')
      : null

    return (
      <div className="GistPanel">
        {gist.get('files').map(file => (
          <div
            key={file.get('filename')}
            className={cx('GistPanel--file', {
              active: file.get('filename') === activeTabName,
            })}
            onClick={() => addTab(file)}
          >
            {file.get('filename')}
          </div>
        ))}
      </div>
    )
  }

}

export default GistPanel
