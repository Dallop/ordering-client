import React from 'react'
import Dom from 'react-dom'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'glamorous'
import { configureStore } from './state'
import App from './App'
import { settings } from './App/UI'

if (__PROD__) {
  // eslint-disable-line
  const store = configureStore()
  const root = document.getElementById('root')

  const Root = () => (
    <Provider {...{ store, key: 'provider' }}>
      <HashRouter>
        <App />
      </HashRouter>
    </Provider>
  )

  Dom.render(<Root />, root)
}

if (__DEV__) {
  // eslint-disable-line
  require('App/views/ManageOrders/test/ControlPanel')
}

if (module.hot) {
  module.hot.accept()
}
