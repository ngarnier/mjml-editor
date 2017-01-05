import React, {
  Component,
} from 'react'

import Iframe from 'components/Iframe'

import './styles.scss'

class Preview extends Component {

  render () {
    return (
      <div className="Preview">
        <Iframe minimize={true} />
      </div>
    )
  }

}

export default Preview
