import React, { Component } from 'react'

import './styles.scss'

class Empty extends Component {

  render () {
    const {
      children,
    } = this.props

    return (
      <div className="Empty">
        <div>
          {children}
        </div>
      </div>
    )
  }

}

export default Empty
