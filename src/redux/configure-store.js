import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

const configureStore = preloadedState => {
  const store = createStore(
    () => {},
    preloadedState,
    applyMiddleware(thunk)
  )

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers').default
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}

export default configureStore
