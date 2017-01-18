import React, { Component, PropTypes } from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Motion, spring } from 'react-motion'
import cx from 'classnames'

import { logout } from 'actions/user'
import { getRateLimit } from 'actions/ratelimit'

import { Dropdown, DropdownItem } from 'components/Dropdown'

import IconGithub from 'icons/Github'

import './styles.scss'

@connect(
  ({ user }) => ({
    profile: user.get('profile'),
  }),
  dispatch => ({
    ...bindActionCreators({
      logout,
      getRateLimit,
    }, dispatch),
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
    if (!nextProps.profile &&
        this.props.profile) {
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
    const {
      getRateLimit,
      logout,
    } = this.props

    logout()
    getRateLimit()

    socket.emit('logout')
  }

  render () {
    const {
      profile,
    } = this.props
    const {
      showDropdown,
    } = this.state

    return (
      <div
        className={cx('Auth', {
          'Auth--signed': profile,
        })}>
        { !profile ?
          <div className="Auth-Signin">
            <a href="/login">
              Signin with Github <IconGithub />
            </a>
          </div> :
          <div
            className="Auth-Profile"
            onClick={this.handleToggleDropdown}
          >
            Signed in as&nbsp;<strong>{profile.get('login')}</strong> <img src={profile.get('avatar_url')} />
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
