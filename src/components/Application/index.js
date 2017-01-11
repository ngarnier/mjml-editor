import React, {
  Component,
} from 'react'

import {
  RoutesProvider,
  MatchWithRoutes,
} from 'react-router-addons-routes'

import routes from 'routes'

import './styles.scss'
import 'styles/utils.scss'

class Application extends Component {

  render () {
    return (
      <RoutesProvider routes={routes}>
        <div className="Application">
          {routes.map(route => <MatchWithRoutes key={route.name} {...route} />)}
        </div>
      </RoutesProvider>
    )
  }

}

export default Application
