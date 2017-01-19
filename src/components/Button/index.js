import React, { Component } from 'react'

import cx from 'classnames'

import './style.scss'

class Button extends Component {

  handleClick = () => {

    const {
      disabled,
      isLoading,
      onClick,
    } = this.props

    if (isLoading || disabled) { return }

    onClick()

  }

  render () {

    const {
      children,
      disabled,
      isLoading,
      primary,
      success,
    } = this.props

    const className = cx('Button', {
      disabled,
      isLoading,
      primary,
      success,
    })

    return (
      <div
        className={className}
        onClick={this.handleClick}
      >
        {isLoading ? 'loading...' : children}
      </div>
    )
  }

}

export default Button
