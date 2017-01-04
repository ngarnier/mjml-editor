import React, {
  Component,
} from 'react'

import {
  connect,
} from 'react-redux'

import cx from 'classnames'
import {
  TransitionMotion,
  spring,
} from 'react-motion'

import {
  Dropdown,
  DropdownItem,
} from 'components/Dropdown'

import IconGithub from 'icons/Github'

import './styles.scss'

@connect(
  ({ user }) => ({ user })
)
class Auth extends Component {

  state = {
    showDropdown: false,
  }

  handleToggleDropdown = () => this.setState(prev => ({
    showDropdown: !prev.showDropdown,
  }))

  handleDropdownClose = () => this.setState({
    showDropdown: false,
  })

  willLeave () {
    return {
      y: spring(25),
      opacity: spring(0),
    }
  }

  getStyles () {
    const {
      showDropdown,
    } = this.state

    return {
      y: spring(showDropdown ? 39 : 25),
      opacity: spring(showDropdown ? 1 : 0),
    }
  }

  render () {
    const {
      user,
    } = this.props
    const {
      showDropdown,
    } = this.state

    return (
      <div className={cx('Auth', {
        'Auth--signed': user !== null,
      })}>
        { user === null ?
          <div className="Auth-Signin">
            <a href="/signin">
              Signin with Github <IconGithub />
            </a>
          </div> :
          <div
            className="Auth-Profile"
            onClick={this.handleToggleDropdown}
          >
            Signed in as&nbsp;<strong>{user.login}</strong> <img src={user.avatar_url} />
          </div> }
        <TransitionMotion
          willLeave={this.willLeave}
          styles={[ {
            key: 'key',
            style: this.getStyles()
          } ]}
        >
        { interpolatedStyles => {
          const {
            key,
            style,
          } = interpolatedStyles[0]

          return (
            <Dropdown
              key={key}
              onClose={this.handleDropdownClose}
              style={{
                opacity: style.opacity,
                transform: `translate3d(0, ${style.y}px, 0)`,
              }}
            >
              <DropdownItem>
                <a href="/logout">
                  Logout
                </a>
              </DropdownItem>
            </Dropdown>
          )
        } }
        </TransitionMotion>
      </div>
    )
  }

}

export default Auth
