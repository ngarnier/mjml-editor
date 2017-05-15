# mjml-editor

## Requirements

- [NodeJS](https://nodejs.org/en/)
- [NPM](http://npmjs.com/) (bundled with NodeJS)
- [Yarn](https://yarnpkg.com/lang/en/)
- [Redis](https://redis.io/download#installation)

## Install

```
yarn
```

### Setup

#### Create an application on Github

In your [applications](https://github.com/settings/applications), register a new app with the following information: 
- **Homepage URL**: host of the app (`http://127.0.0.1` if running locally)
- **Authorization callback URL**: authority of the app (`http://127.0.0.1:3333/` if running locally)

#### Configure the app environment

Create a `.env` file as follow:

```
HOST=
PORT=3333
API_URL=http://localhost:3333/api
GITHUB_CLIENT_ID=<client-id>
GITHUB_CLIENT_SECRET=<client-secret>
SESSION_SECRET=<secret-string-of-your-choice>
```

### Launch

```
redis-server
yarn run dev
```
