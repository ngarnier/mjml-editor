import React, { Component } from 'react'

import cx from 'classnames'
import { connect } from 'react-redux'
import Steack from 'react-steack'

import { removeNotif } from 'actions/notifications'

import './style.scss'

@connect(state => ({
  notifs: state.notifications,
}), {
  removeNotif,
})
class Notifications extends Component {

  removeNotif = id => () => this.props.removeNotif(id)

  render () {

    // react-steack accepts an array of childs, not an Immutable.List
    // this will maybe change in the future...
    const notifs = this.props.notifs.toJS()

    return (
      <div className="Notifications">
        <Steack
          reverse={true}
          align="right"
        >
          {notifs.map(n => (
            <div
              key={n.id}
              className={cx('Notif', n.type)}
              onClick={this.removeNotif(n.id)}
            >
              {n.message}
            </div>
          ))}
        </Steack>
      </div>
    )
  }

}

export default Notifications
