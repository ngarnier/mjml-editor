import React, {
  Component,
} from 'react'

import Editor from 'components/Editor'

import './styles.scss'

class Home extends Component {

  render () {
    return (
      <div className="Home">
        <Editor />
      </div>
    )
  }

}

export default Home
