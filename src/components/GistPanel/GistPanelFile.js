import React, { Component } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'

import {
  isLoading,
} from 'reducers/loaders'

import {
  addTab,
} from 'actions/editor'

import CloseIcon from 'icons/Close'
import PencilIcon from 'icons/Pencil'

@connect((state, props) => ({
  isDeleting: isLoading(state, 'REMOVE_FILE_FROM_GIST', props.file.get('filename')),
}), {
  addTab,
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

    const {
      value,
    } = this.state

    if (!value) { return }

    const realValue = value.endsWith('.mjml')
      ? value
      : `${value}.mjml`

    console.log(`saving ${realValue}`)

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
      onDelete,
      addTab,
      activeTabName,
      isDeleting,
    } = this.props

    return (
      <div
        className={cx('GistPanelFile', {
          active: file.get('filename') === activeTabName,
        })}
      >
        {isDeleting ? (
          <div
            key="name"
            className="GistPanelFile--name isDeleting"
          >
            {'deleting...'}
          </div>
        ) : isEditing ? (
          <input
            ref={n => this._input = n}
            value={value}
            className="GistPanelFile--input"
            onKeyDown={this.handleKeyDown}
            onChange={this.handleChange}
            onBlur={this.saveEditing}
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
            <div
              className="GistPanelFile--action"
              onClick={this.setEditing}
            >
              <PencilIcon className="pencil" />
            </div>
            <div
              className="GistPanelFile--action"
              onClick={() => onDelete(file)}
            >
              <CloseIcon className="remove" />
            </div>
          </div>,
        ]}

      </div>
    )
  }

}

export default GistPanelFile
