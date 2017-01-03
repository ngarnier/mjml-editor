import React, {
  Component,
} from 'react'

import {
  Link,
  Match,
} from 'react-router'

import Editor from 'pages/Editor'

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
        </div>
        <Match
          component={Editor}
          exactly={true}
          pattern="/"
        />
      </div>
    )
  }

}

export default Application
