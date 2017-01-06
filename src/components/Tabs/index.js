import React, {
  Component,
} from 'react'

import noop from 'lodash/noop'

import cx from 'classnames'

import IconRemove from 'icons/Remove'

import './styles.scss'

class Tabs extends Component {

  render () {
    const {
      children,
    } = this.props

    return (
      <div className="Tabs">
        {children}
      </div>
    )
  }

}

class Tab extends Component {

  static defaultProps = {
    onClick: noop,
    onRemove: noop,
    remove: true,
  }

  render () {
    const {
      active,
      children,
      float,
      onClick,
      onRemove,
      remove,
    } = this.props

    return (
      <div
        className={cx('Tab', {
          'Tab--float': float,
          'Tab--active': active,
        })}
        onClick={onClick}
      >
        {children}
        { remove &&
          <div
            className="Tab-Remove"
            onClick={onRemove}
          >
            <IconRemove />
          </div> }
      </div>
    )
  }

}

export {
  Tabs,
  Tab,
}
