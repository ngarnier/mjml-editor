import React, {
  Component,
} from 'react'

import {
  Match,
} from 'react-router'

import Home from 'pages/Home'
import Preview from 'pages/Preview'

import './styles.scss'
import 'styles/utils.scss'

class Application extends Component {

  render () {
    return (
      <div className="Application">

        <Match
          exactly={true}
          pattern="/"
          component={Home}
        />

        <Match
          pattern="/gist/:gistID"
          component={Home}
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
