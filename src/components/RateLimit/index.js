import React, { Component } from 'react'

import { connect } from 'react-redux'
import cx from 'classnames'
import dateFns from 'date-fns'

import './styles.scss'

@connect(
  ({ ratelimit }) => ({ ratelimit })
)
class RateLimit extends Component {

  render () {
    const {
      ratelimit,
    } = this.props

    const limit = 100 - (ratelimit.get('remaining') / ratelimit.get('limit') * 100)
    const remaining = 100 - limit

    return (
      <div className={cx('RateLimit', {
        'RateLimit--full': remaining === 100,
        'RateLimit--empty': limit === 100,
      })}>
        <div className="RateLimit-Reset">
          Reset at {dateFns.format(new Date(ratelimit.get('reset') * 1000), 'HH:mm:ss')}
        </div>
        <div className="RateLimit-Progress">
          <div
            className="RateLimit-Limit"
            style={{
              width: `${limit}%`
            }}
          >
            {ratelimit.get('limit') - ratelimit.get('remaining')}
          </div>
          <div
            className="RateLimit-Remaining"
            style={{
              width: `${remaining}%`
            }}
          >
            {ratelimit.get('remaining')}
          </div>
        </div>
      </div>
    )
  }

}

export default RateLimit
