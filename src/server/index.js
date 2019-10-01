import * as dotenv from 'dotenv'
import path from 'path'
import React from 'react'
import { Provider } from 'react-redux'
import express from 'express'
import * as compression from 'compression'
import * as session from 'express-session'
import * as bodyParser from 'body-parser'
import * as lusca from 'lusca'
import * as expressStatusMonitor from 'express-status-monitor'
import serialize from 'serialize-javascript'
import { StaticRouter } from 'react-router-dom'
import { renderToString } from 'react-dom/server'
import { HelmetProvider } from 'react-helmet-async'
import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server'
import logger from './logger'
import App from '../App'
import configureStore from '../redux/configure-store'
import routes from '../routes'
dotenv.config()

// import * as multer from 'multer'
// import path from 'path'
// const upload = multer({ dest: path.join(__dirname, 'public') })

const server = express()
server.use(expressStatusMonitor())
server.use(compression())
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true }))
server.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  cookie: { maxAge: 31557600000 }
}))

server.use((req, res, next) => {
  if (req.path === '/api/upload') { // define this path later
    next()
  } else {
    lusca.csrf()(req, res, next)
  }
})

server.use(lusca.xframe('SAMEORIGIN'))
server.use(lusca.xssProtection(true))
server.disable('x-powered-by')
logger.info(`public path for assets: ${process.env.RAZZLE_PUBLIC_DIR}`)
server.use(express.static(process.env.RAZZLE_PUBLIC_DIR, { maxAge: 31557600000 }))

server.get(routes.index.get, async (req, res) => {
  const extractor = new ChunkExtractor({
    statsFile: path.join(__dirname, 'loadable-stats.json'),
    entrypoints: ['client']
  })

  const context = {}

  // Compile an initial state
  // const preloadedState = { }

  const store = configureStore(/* preloadedState */)
  const finalState = store.getState()
  const app = (
    <ChunkExtractorManager extractor={extractor}>
      <StaticRouter context={context} location={req.url}>
        <HelmetProvider context={context}>
          <Provider store={store}>
            <App />
          </Provider>
        </HelmetProvider>
      </StaticRouter>
    </ChunkExtractorManager>
  )
  const markup = renderToString(app)

  if (context.url) {
    res.redirect(context.url)
    return
  }

  const { helmet } = context

  res.send(`
    <!doctype html>
    <html ${helmet.htmlAttributes.toString()}>
    <head>
        ${helmet.title.toString()}
        ${helmet.meta.toString()}
        ${helmet.link.toString()}
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${extractor.getLinkTags()}
        ${extractor.getStyleTags()}
    </head>

    <body ${helmet.bodyAttributes.toString()}>
      <div id="root">${markup}</div>
      ${extractor.getScriptTags()}
      <script>
        window.__PRELOADED_STATE__ = ${serialize(finalState)}
      </script>
    </body>
    </html>
  `)
})

server.get(routes.counter.get, (req, res) => {
  const extractor = new ChunkExtractor({
    statsFile: path.join(__dirname, 'loadable-stats.json'),
    entrypoints: ['client']
  })

  const context = {}

  // Compile an initial state
  // const preloadedState = { }

  const store = configureStore(/* preloadedState */)
  const finalState = store.getState()
  const app = (
    <ChunkExtractorManager extractor={extractor}>
      <StaticRouter context={context} location={req.url}>
        <HelmetProvider context={context}>
          <Provider store={store}>
            <App />
          </Provider>
        </HelmetProvider>
      </StaticRouter>
    </ChunkExtractorManager>
  )
  const markup = renderToString(app)

  if (context.url) {
    res.redirect(context.url)
    return
  }

  const { helmet } = context

  res.send(`
    <!doctype html>
    <html ${helmet.htmlAttributes.toString()}>
    <head>
        ${helmet.title.toString()}
        ${helmet.meta.toString()}
        ${helmet.link.toString()}
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${extractor.getLinkTags()}
        ${extractor.getStyleTags()}
    </head>

    <body ${helmet.bodyAttributes.toString()}>
      <div id="root">${markup}</div>
      ${extractor.getScriptTags()}
      <script>
        window.__PRELOADED_STATE__ = ${serialize(finalState)}
      </script>
    </body>
    </html>
  `)
})

export default server
