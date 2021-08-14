import React, { Component } from 'react'
import 'rsuite/dist/styles/rsuite-default.css'
import { Nav, Icon, Navbar } from 'rsuite'
import { Link } from 'react-router-dom'

export default class HeaderComponent extends Component {
  render() {
    return (
      <div>
        <React.Fragment>
          <Navbar>
            <Navbar.Header>
              {/* <a href="#" className="navbar-brand logo">
                RSUITE
              </a> */}
            </Navbar.Header>
            <Navbar.Body>
              <Nav>
                <Nav.Item icon={<Icon icon="home" />}>
                  <Link to="/">Home</Link>
                </Nav.Item>
                <Nav.Item>
                  <Link to="/persons">Personnel</Link>
                </Nav.Item>
                <Nav.Item>Tasks</Nav.Item>
                <Nav.Item>Projects</Nav.Item>
              </Nav>
              <Nav pullRight>
                <Nav.Item icon={<Icon icon="cog" />}>Settings</Nav.Item>
              </Nav>
            </Navbar.Body>
          </Navbar>
        </React.Fragment>
      </div>
    )
  }
}
