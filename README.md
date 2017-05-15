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
