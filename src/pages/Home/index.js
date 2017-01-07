import React, {
  Component,
} from 'react'

import Editor from 'components/Editor'
import Auth from 'components/Auth'
import Notifications from 'components/Notifications'

import IconMjml from 'icons/Mjml'

import './styles.scss'

class Home extends Component {

  render () {
    return (
      <div className="Home">

        <Notifications />

        <div className="Application-Header">
          <div className="Application-Header-Logo">
            <IconMjml />
          </div>
          <Auth />
        </div>

        <Editor />

      </div>
    )
  }

}

export default Home
