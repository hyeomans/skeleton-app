import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Button } from 'reactstrap'
import logo from './react.svg'
import './Home.css'
import routes from './routes'

class Home extends React.Component {
  render () {
    return (
      <div className="Home">
        <div className="Home-header">
          <img src={logo} className="Home-logo" alt="logo" />
          <h2>Welcome to Razzle</h2>
        </div>
        <p className="Home-intro">
          To get started, edit <code>src/App.js</code> or{' '}
          <code>src/Home.js</code> and save to reload.
        </p>
        <ul className="Home-resources">
          <li>
            <Button color="danger">
              Docs
            </Button>
          </li>
          <li>
            <RouterLink to={routes.counter.get}>Visita la página del Counter</RouterLink>
          </li>
        </ul>
      </div>
    )
  }
}

export default Home
