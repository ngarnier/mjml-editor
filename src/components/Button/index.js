import React, { Component } from 'react'
import cx from 'classnames'

import './style.scss'

class Button extends Component {

  handleClick = () => {

    const {
      isLoading,
      onClick,
    } = this.props

    if (isLoading) { return }

    onClick()

  }

  render () {

    const {
      primary,
      success,
      children,
      isLoading,
    } = this.props

    const className = cx('Button', {
      primary,
      success,
      isLoading,
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
