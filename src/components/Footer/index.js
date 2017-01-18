import React, { Component } from 'react'

import map from 'lodash/map'

import cx from 'classnames'

import './styles.scss'

class Footer extends Component {

  static defaultProps = {
    align: 'left',
  }

  render () {
    const {
      items,
      align,
    } = this.props

    return (
      <div
        className={cx('Footer', {
          [`Footer--align-${align}`]: true,
        })}
      >
        { map(items, (item, index) => (
          <div
            className="Footer-Item"
            key={index}
          >
            {item}
          </div>
        )) }
      </div>
    )
  }

}

export default Footer
