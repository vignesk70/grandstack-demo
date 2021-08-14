// FooterComponent.js
import React, { Component } from 'react'
import { Container, FlexboxGrid } from 'rsuite'

class FooterComponent extends Component {
  render() {
    return (
      <div>
        <Container className="footer">
          <FlexboxGrid justify="center">
            Copyright 2021 Tunjang Jaya Graftek
          </FlexboxGrid>
        </Container>
      </div>
    )
  }
}

export default FooterComponent
