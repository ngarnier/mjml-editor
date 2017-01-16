import React, { Component, PropTypes } from 'react'

import { connect } from 'react-redux'

import cx from 'classnames'
import { Motion, spring } from 'react-motion'

import { Dropdown, DropdownItem } from 'components/Dropdown'

import IconGithub from 'icons/Github'

import './styles.scss'

@connect(
  ({ user }) => ({ user }),
  dispatch => ({
    logout: () => dispatch({ type: 'LOGOUT' }),
  })
)
class Auth extends Component {

  static contextTypes = {
    socket: PropTypes.object,
  }

  state = {
    showDropdown: false,
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.user === null &&
        this.props.user !== null) {
      this.setState({
        showDropdown: false,
      })
    }
  }

  handleToggleDropdown = () => this.setState(prev => ({
    showDropdown: !prev.showDropdown,
  }))

  handleDropdownClose = () => this.setState({
    showDropdown: false,
  })

  handleClickLogout = () => {
    const {
      socket,
    } = this.context

    socket.emit('logout')

    this.props.logout()
  }

  render () {
    const {
      user,
    } = this.props
    const {
      showDropdown,
    } = this.state

    return (
      <div
        className={cx('Auth', {
          'Auth--signed': user !== null,
        })}>
        { user === null ?
          <div className="Auth-Signin">
            <a href="/login">
              Signin with Github <IconGithub />
            </a>
          </div> :
          <div
            className="Auth-Profile"
            onClick={this.handleToggleDropdown}
          >
            Signed in as&nbsp;<strong>{user.login}</strong> <img src={user.avatar_url} />
          </div> }
        <Motion
          style={{
            y: spring(showDropdown ? 43 : 39),
            opacity: spring(showDropdown ? 1 : 0),
          }}
        >
          { style =>
            <Dropdown
              onClose={this.handleDropdownClose}
              style={{
                opacity: style.opacity,
                transform: `translate3d(0, ${style.y}px, 0)`,
              }}
            >
              <DropdownItem onClick={this.handleClickLogout}>
                Sign out
              </DropdownItem>
            </Dropdown> }
        </Motion>
      </div>
    )
  }

}

export default Auth
