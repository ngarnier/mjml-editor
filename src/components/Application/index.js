import React, {
  Component,
} from 'react'

import {
  Link,
  Match,
} from 'react-router'

import Editor from 'pages/Editor'

import './styles.scss'

class Application extends Component {

  render () {
    return (
      <div className="Application">
        <div className="Application-Header">

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
