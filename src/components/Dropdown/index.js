import React, { Component } from 'react'

import cx from 'classnames'

import './styles.scss'

class Dropdown extends Component {

  componentWillReceiveProps (nextProps) {
    const {
      isOpen,
    } = this.props

    if (nextProps.isOpen !== isOpen) {
      this.toggleClickOutsideEvent(nextProps.isOpen)
    }
  }

  componentWillUnmount () {
    document.removeEventListener('click', this.handleClickOutside)
  }

  handleClickOutside = e => {
    const {
      onClose,
    } = this.props

    if (this.dropdown &&
        !this.dropdown.contains(e.target)) {
      onClose()
    }
  }

  toggleClickOutsideEvent (enabled) {
    if (enabled) {
      document.addEventListener('click', this.handleClickOutside)
    } else {
      document.removeEventListener('click', this.handleClickOutside)
    }
  }

  render () {
    const {
      children,
      style,
    } = this.props

    return (
      <div
        className="Dropdown"
        ref={r => this.dropdown = r}
        style={style}
      >
        {children}
      </div>
    )
  }

}

class DropdownItem extends Component {

  render () {
    const {
      onClick,
      children,
    } = this.props

    return (
      <div
        className={cx('Dropdown-Item', {
          'Dropdown-Item--action': onClick,
        })}
        onClick={onClick}
      >
        {children}
      </div>
    )
  }

}

export {
  Dropdown,
  DropdownItem,
}
