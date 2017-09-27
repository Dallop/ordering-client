import React from 'react'
import Dom from 'react-dom'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'glamorous'
import { configureStore } from './state'
import App from './App'
import { settings } from './App/UI'

const store = configureStore()
const root = document.getElementById('root')

const Root = () => (
  <Provider {...{ store, key: 'provider' }}>
    <ThemeProvider theme={settings}>
      <HashRouter>
        <App />
      </HashRouter>
    </ThemeProvider>
  </Provider>
)

Dom.render(<Root />, root)

if (module.hot) {
  module.hot.accept()
}
