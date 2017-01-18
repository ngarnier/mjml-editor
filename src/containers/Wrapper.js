import React, { Component, PropTypes } from 'react'

import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router'

import socket from 'helpers/getClientSocket'

class Wrapper extends Component {

  static childContextTypes = {
    socket: PropTypes.object,
  }

  getChildContext () {
    return {
      socket,
    }
  }

  render () {
    const {
      children,
      store,
    } = this.props

    return (
      <Provider store={store}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </Provider>
    )
  }

}

export default Wrapper
