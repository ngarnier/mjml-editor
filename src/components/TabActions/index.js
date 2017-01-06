import React, { Component } from 'react'
import { connect } from 'react-redux'

import saveCurrentTabToGist from 'actions/saveCurrentTabToGist'

import Button from 'components/Button'

import './style.scss'

@connect(null, {
  saveCurrentTabToGist,
})
class TabActions extends Component {

  render () {

    const {
      saveCurrentTabToGist,
    } = this.props

    return (
      <div className="TabActions">
        <div className="horizontal-list">
          <Button
            success
            onClick={saveCurrentTabToGist}
          >
            {'save'}
          </Button>
        </div>
      </div>
    )
  }

}

export default TabActions
