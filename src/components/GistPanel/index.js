import React, { Component } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'

import './styles.scss'

import { getActiveTab } from 'reducers/editor'

import { addTab } from 'actions/editor'

import CloseIcon from 'icons/Close'
import PencilIcon from 'icons/Pencil'

@connect(state => ({
  gist: state.gist,
  activeTab: getActiveTab(state),
}), {
  addTab,
})
class GistPanel extends Component {

  renderFile = activeTabName => file => {

    const {
      addTab,
    } = this.props

    return (
      <div
        key={file.get('filename')}
        className={cx('GistPanelFile', {
          active: file.get('filename') === activeTabName,
        })}
        onClick={() => addTab(file)}
      >
        <div className="GistPanelFile--name">
          {file.get('filename')}
        </div>
        <div className="GistPanelFile--actions">
          <div className="GistPanelFile--action">
            <PencilIcon
              className="pencil"
            />
          </div>
          <div className="GistPanelFile--action">
            <CloseIcon
              className="remove"
            />
          </div>
        </div>
      </div>
    )
  }

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
        {gist.get('files').map(this.renderFile(activeTabName))}
      </div>
    )
  }

}

export default GistPanel
