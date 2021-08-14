// App.js
import React from 'react'

import { BrowserRouter as Router } from 'react-router-dom'

import Main from './components/MainComponent'

export default function App() {
  return (
    <Router>
      <div>
        <Main />
      </div>
    </Router>
  )
}
