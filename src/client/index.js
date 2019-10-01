import React from 'react'
import { hydrate } from 'react-dom'
import { Provider } from 'react-redux'
import { HelmetProvider } from 'react-helmet-async'
import { Router } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { loadableReady } from '@loadable/component'

import configureStore from '../redux/configure-store'
import App from '../App'

const preloadedState = window.__PRELOADED_STATE__
delete window.__PRELOADED_STATE__ // If you want to check what's comming from the server, comment this line and then you can do `console.log(__PRELOADED_STATE__)`
const store = configureStore(preloadedState)
const supportsHistory = 'pushState' in window.history
const history = createBrowserHistory()

class Client extends React.Component {
  componentDidMount () {
    const jssStyles = document.getElementById('jss-server-side')
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles)
    }
  }

  render () {
    return (
      <Router history={history} forceRefres={!supportsHistory}>
        <HelmetProvider>
          <Provider store={store}>
            <App />
          </Provider>
        </HelmetProvider>
      </Router>
    )
  }
}

loadableReady(() => {
  hydrate(<Client />, document.getElementById('root'))
})

if (module.hot) {
  module.hot.accept('../App', () => {
    hydrate(<Client />, document.getElementById('root'))
  })
}
