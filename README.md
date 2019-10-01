## Quick Start

### `npm start` or `yarn start`

Runs the project in development mode.  
You can view your application at `http://localhost:3000`

The page will reload if you make edits.

### `npm run build` or `yarn build`

Builds the app for production to the build folder.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

### `npm run start:prod` or `yarn start:prod`

Runs the compiled app in production.

You can again view your application at `http://localhost:3000`

### `npm test` or `yarn test`

Runs the test watcher (Jest) in an interactive mode.
By default, runs tests related to files changed since the last commit.

### `npm start -- --inspect` or `yarn start -- --inspect`

To debug the node server, you can use `razzle start --inspect`. This will start the node server and enable the inspector agent. For more information, see [this](https://nodejs.org/en/docs/inspector/).

### `npm start -- --inspect-brk` or `yarn start -- --inspect-brk`

To debug the node server, you can use `razzle start --inspect-brk`. This will start the node server, enable the inspector agent and Break before user code starts. For more information, see [this](https://nodejs.org/en/docs/inspector/).

### `rs`

If your application is running, and you need to manually restart your server, you do not need to completely kill and rebundle your application. Instead you can just type `rs` and press enter in terminal.

## <img src="https://user-images.githubusercontent.com/4060187/37915268-209644d0-30e7-11e8-8ef7-086b529ede8c.png" width="500px" alt="Razzle Hot Restart"/>

<!-- START doctoc generated TOC please keep comment here to allow auto update -->

<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

**Table of Contents**

* [Customization](#customization)
  * [Extending Babel Config](#extending-babel-config)
  * [Extending Webpack](#extending-webpack)
  * [Environment Variables](#environment-variables)
  * [Adding Temporary Environment Variables In Your Shell](#adding-temporary-environment-variables-in-your-shell)
    * [Windows (cmd.exe)](#windows-cmdexe)
    * [Linux, macOS (Bash)](#linux-macos-bash)
  * [Adding Environment Variables In `.env`](#adding-environment-variables-in-env)
    * [What other `.env` files are can be used?](#what-other-env-files-are-can-be-used)
* [How Razzle works (the secret sauce)](#how-razzle-works-the-secret-sauce)
* [Inspiration](#inspiration)
  * [Author](#author)
* [Contributors](#contributors)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Customization

### Customizing Babel Config

Razzle comes with most of ES6 stuff you need. However, if you want to add your own babel transformations, just add a `.babelrc` file to the root of your project.

```js
{
  "presets": [
    "razzle/babel", // NEEDED
    "stage-0"
   ],
   "plugins": [
     // additional plugins
   ]
}
```

A word of advice: the `.babelrc` file will replace the internal razzle babelrc template. You must include at the very minimum the default razzle/babel preset.

### Extending Webpack

You can also extend the underlying webpack config. Create a file called `razzle.config.js` in your project's root.

```js
// razzle.config.js

module.exports = {
  modify: (config, { target, dev }, webpack) => {
    // do something to config

    return config;
  },
};
```

A word of advice: `razzle.config.js` is an escape hatch. However, since it's just JavaScript, you can and should publish your `modify` function to npm to make it reusable across your projects. For example, imagine you added some custom webpack loaders and published it as a package to npm as `my-razzle-modifictions`. You could then write your `razzle.config.js` like so:

```
// razzle.config.js
const modify = require('my-razzle-modifictions');

module.exports = {
  modify
}
```

Last but not least, if you find yourself needing a more customized setup, Razzle is _very_ forkable. There is one webpack configuration factory that is 300 lines of code, and 4 scripts (`build`, `start`, `test`, and `init`). The paths setup is shamelessly taken from [create-react-app](https://github.com/facebookincubator/create-react-app), and the rest of the code related to logging.

### Environment Variables

`dotenv` is used by default.

Copy the `.env.example` as `.env` like:

```
>cp .env.example .env
```

## Deploying

```
>yarn build
>cp .env build/.env <---- modify environment variables for Production
```

## How Razzle works (the secret sauce)

**tl;dr**: 2 configs, 2 ports, 2 webpack instances, both watching and hot reloading the same filesystem, in parallel during development and a little `webpack.output.publicPath` magic.

In development mode (`razzle start`), Razzle bundles both your client and server code using two different webpack instances running with Hot Module Replacement in parallel. While your server is bundled and run on whatever port your specify in `src/index.js` (`3000` is the default), the client bundle (i.e. entry point at `src/client.js`) is served via `webpack-dev-server` on a different port (`3001` by default) with its `publicPath` explicitly set to `localhost:3001` (and not `/` like many other setups do). Then the server's html template just points to the absolute url of the client JS: `localhost:3001/static/js/client.js`. Since both webpack instances watch the same files, whenever you make edits, they hot reload at _exactly_ the same time. Best of all, because they use the same code, the same webpack loaders, and the same babel transformations, you never run into a React checksum mismatch error.

## Inspiration

* [palmerhq/backpack](https://github.com/palmerhq/backpack)
* [nytimes/kyt](https://github.com/nytimes/kyt)
* [facebookincubator/create-react-app](https://github.com/facebookincubator/create-react-app)
* [humblespark/sambell](https://github.com/humblespark/sambell)
* [zeit/next.js](https://github.com/zeit/next.js)

#### Author

* [Jared Palmer](https://twitter.com/jaredpalmer)

---

MIT License

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->

| [<img src="https://avatars2.githubusercontent.com/u/4060187?v=4" width="100px;"/><br /><sub>Jared Palmer</sub>](http://jaredpalmer.com)<br />[💬](#question-jaredpalmer 'Answering Questions') [💻](https://github.com/jaredpalmer/razzle/commits?author=jaredpalmer 'Code') [🎨](#design-jaredpalmer 'Design') [📖](https://github.com/jaredpalmer/razzle/commits?author=jaredpalmer 'Documentation') [💡](#example-jaredpalmer 'Examples') [🤔](#ideas-jaredpalmer 'Ideas, Planning, & Feedback') [👀](#review-jaredpalmer 'Reviewed Pull Requests') [⚠️](https://github.com/jaredpalmer/razzle/commits?author=jaredpalmer 'Tests') [🔧](#tool-jaredpalmer 'Tools') | [<img src="https://avatars3.githubusercontent.com/u/1415847?v=4" width="100px;"/><br /><sub>Jari Zwarts</sub>](https://jari.io)<br />[💬](#question-jariz 'Answering Questions') [💻](https://github.com/jaredpalmer/razzle/commits?author=jariz 'Code') [🤔](#ideas-jariz 'Ideas, Planning, & Feedback') [🔌](#plugin-jariz 'Plugin/utility libraries') [👀](#review-jariz 'Reviewed Pull Requests') | [<img src="https://avatars0.githubusercontent.com/u/810438?v=4" width="100px;"/><br /><sub>Dan Abramov</sub>](http://twitter.com/dan_abramov)<br />[💻](https://github.com/jaredpalmer/razzle/commits?author=gaearon 'Code') [🤔](#ideas-gaearon 'Ideas, Planning, & Feedback') | [<img src="https://avatars0.githubusercontent.com/u/15182?v=4" width="100px;"/><br /><sub>Eric Clemmons</sub>](http://ericclemmons.github.com/)<br />[💻](https://github.com/jaredpalmer/razzle/commits?author=ericclemmons 'Code') [🤔](#ideas-ericclemmons 'Ideas, Planning, & Feedback') |
| :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |


<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!
