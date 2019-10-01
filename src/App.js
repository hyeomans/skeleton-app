import React from 'react'
import { Route, Switch } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import routes from './routes'
import loadable from '@loadable/component'

// const NotFound = loadable(() => import('./NotFound'))
const HomePage = loadable(() => import('./Home'))
const CounterPage = loadable(() => import('./Counter'))

const App = () => (
  <Switch>
    <Route exact path={routes.index.get} component={HomePage} />
    <Route path={routes.counter.get} component={CounterPage} />
  </Switch>
)

export default App
