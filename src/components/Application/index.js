import React, {
  Component,
} from 'react'

import {
  Match,
} from 'react-router'

import Home from 'pages/Home'
import Preview from 'pages/Preview'

import Auth from 'components/Auth'
import Notifications from 'components/Notifications'

import IconMjml from 'icons/Mjml'

import './styles.scss'
import 'styles/utils.scss'

class Application extends Component {

  render () {
    return (
      <div className="Application">

        <Notifications />

        <Match
          exactly={true}
          pattern="/"
          render={() => (
            <div>
              <div className="Application-Header">
                <div className="Application-Header-Logo">
                  <IconMjml />
                </div>
                <Auth />
              </div>
              <Home />
            </div>
          )}
        />

        <Match
          component={Preview}
          pattern="/preview"
        />

      </div>
    )
  }

}

export default Application
