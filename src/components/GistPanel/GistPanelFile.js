import React, { Component } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'

import {
  addTab,
} from 'actions/editor'

import {
  removeFileFromGist,
} from 'actions/gists'

import CloseIcon from 'icons/Close'
import PencilIcon from 'icons/Pencil'

@connect(null, {
  addTab,
  removeFileFromGist,
})
class GistPanelFile extends Component {

  state = {
    isEditing: false,
    value: '',
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.isEditing && !prevState.isEditing) {
      this._input.focus()
    }
  }

  setEditing = () => {
    this.setState({
      isEditing: true,
      value: this.props.file.get('filename'),
    })
  }

  stopEditing = () => {
    this.setState({
      isEditing: false,
      value: '',
    })
  }

  saveEditing = () => {
    this.stopEditing()
  }

  handleChange = e => {
    this.setState({
      value: e.target.value,
    })
  }

  handleKeyDown = e => {
    switch (e.which) {
    case 13:
      this.saveEditing()
      break
    case 27:
      this.stopEditing()
      break
    default:
      break
    }
  }

  render () {

    const {
      isEditing,
      value,
    } = this.state

    const {
      file,
      addTab,
      activeTabName,
      removeFileFromGist,
    } = this.props

    return (
      <div
        className={cx('GistPanelFile', {
          active: file.get('filename') === activeTabName,
        })}
      >
        {isEditing ? (
          <input
            ref={n => this._input = n}
            value={value}
            className="GistPanelFile--input"
            onKeyDown={this.handleKeyDown}
            onChange={this.handleChange}
          />
        ) : [
          <div
            key="name"
            className="GistPanelFile--name"
            onClick={() => addTab(file)}
          >
            {file.get('filename')}
          </div>,
          <div
            key="actions"
            className="GistPanelFile--actions"
          >
            <div className="GistPanelFile--action">
              <PencilIcon
                onClick={this.setEditing}
                className="pencil"
              />
            </div>
            <div className="GistPanelFile--action">
              <CloseIcon
                onClick={() => removeFileFromGist(file.get('filename'))}
                className="remove"
              />
            </div>
          </div>,
        ]}
      </div>
    )
  }

}

export default GistPanelFile
