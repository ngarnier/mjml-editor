import React, {
  Component,
} from 'react'

import {
  Link,
  Match,
} from 'react-router'

import Home from 'pages/Home'

import Auth from 'components/Auth'

import IconMjml from 'icons/Mjml'

import './styles.scss'

class Application extends Component {

  render () {
    return (
      <div className="Application">
        <div className="Application-Header">
          <div className="Application-Header-Logo">
            <IconMjml />
          </div>
          <Auth />
        </div>
        <Match
          component={Home}
          exactly={true}
          pattern="/"
        />
      </div>
    )
  }

}

export default Application
