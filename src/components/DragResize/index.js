import React, { Component } from 'react'

import { connect } from 'react-redux'

import {
  getRect,
} from 'helpers/dom'

import './style.scss'

let emptyImage

if (__BROWSER__) {
  emptyImage = new Image()
  emptyImage.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
}

const LEFT_CLASS = '.Editor-Left'
const RIGHT_CLASS = '.Editor-Right'

const STEP = 10

@connect(null, dispatch => ({
  updateEditorSize: (percent) => dispatch({
    type: 'SET_EDITOR_SIZE',
    payload: percent,
  }),
}))
class DragResize extends Component {

  state = {
    isDragging: false,
  }

  componentDidUpdate (prevProps, prevState) {

    const hasStartedDragging = this.state.isDragging && !prevState.isDragging
    const hasFinishedDragging = !this.state.isDragging && prevState.isDragging

    if (hasStartedDragging) {
      this.measureContainer()
    }

    if (hasFinishedDragging) {
      this.emitPercent()
    }

  }

  emitPercent = () => {
    const absOffset = this._lastBarOffset + this._leftWidth
    const percent = Math.round((absOffset / this._totalWidth) * 100)
    this.props.updateEditorSize(percent)
  }

  measureContainer = () => {

    // yeah, hard coded selectors, do you like it?
    const leftRect = getRect(document.querySelector(LEFT_CLASS))
    const rightRect = getRect(document.querySelector(RIGHT_CLASS))

    // keep some useful values
    this._leftWidth = leftRect.width
    this._totalWidth = leftRect.width + rightRect.width
    this._leftOffset = leftRect.left
    this._centerOffset = leftRect.right

  }

  measureX = (eventX) => window.requestAnimationFrame(() => {

    if (!this.state.isDragging || eventX === 0) { return }

    const offsetFromCenter = eventX - this._centerOffset
    const nb = Math.round(offsetFromCenter / STEP)
    const offset = nb * STEP

    if (offset !== this._lastBarOffset) {
      this._lastBarOffset = offset
      this.emitPercent()
    }

  })

  handleDragStart = e => {
    e.dataTransfer.setDragImage(emptyImage, 0, 0)
    this.setState({
      isDragging: true,
    })
  }

  handleDrag = e => {
    this.measureX(e.screenX)
  }

  handleDragEnd = e => {

    // prevent eventually pasting text
    // into editor
    e.preventDefault()

    this.setState({
      isDragging: false,
    })

  }

  setBarRef = n => this._bar = n

  render () {
    return (
      <div
        className="DragResize"
        draggable
        onDragStart={this.handleDragStart}
        onDrag={this.handleDrag}
        onDragEnd={this.handleDragEnd}
      >
        <div
          ref={this.setBarRef}
          className="bar"
        />
      </div>
    )
  }

}

export default DragResize
