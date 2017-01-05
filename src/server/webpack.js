import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

import webpackConfig from '../../webpack/dev.config.babel'

export default app => {
  const compiler = webpack(webpackConfig)

  const devMiddlewareConfig = {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
  }

  app.use(webpackDevMiddleware(compiler, devMiddlewareConfig))
  app.use(webpackHotMiddleware(compiler))
}
