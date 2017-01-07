import Home from 'pages/Home'
import Preview from 'pages/Preview'

const routes = [
  {
    pattern: '/',
    exactly: true,
    name: 'home',
    component: Home,
  },
  {
    pattern: '/gists/:gistID',
    name: 'gist',
    component: Home,
  },
  {
    pattern: '/preview',
    name: 'preview',
    component: Preview,
  },
]

export default routes
