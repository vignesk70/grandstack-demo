// MainComponent.json
import React, { Component } from 'react'
import 'rsuite/dist/styles/rsuite-default.css'
import { Container, Header, Content, Footer } from 'rsuite'
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom'
import HomePage from './HomePageComponent'
import HeaderComponent from './HeaderComponent'
import FooterComponent from './FooterComponent'
import PersonPage from './PersonPageComponent'

class Main extends Component {
  render() {
    return (
      <div>
        <Router>
          <Container>
            <Header>
              {' '}
              <HeaderComponent />
            </Header>
            <Content>
              <Switch>
                <Route exact path="/" component={HomePage} />
                <Route path="/persons" component={PersonPage} />
              </Switch>
            </Content>
            <Footer>
              <FooterComponent />
            </Footer>
          </Container>
        </Router>
      </div>
    )
  }
}
export default Main
