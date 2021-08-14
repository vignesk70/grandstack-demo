import React, { Component } from 'react'
import { Container, FlexboxGrid } from 'rsuite'
// import { useQuery, gql } from '@apollo/client'
import PersonCount from './PersonCountComponent'
import ProjectCount from './ProjectCountComponent'

class HomePageComponent extends Component {
  render() {
    return (
      <div>
        <Container className="container">
          <FlexboxGrid justify="center" align="middle">
            <FlexboxGrid.Item colspan={10}>
              <PersonCount />
            </FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={10}>
              <ProjectCount />
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </Container>
      </div>
    )
  }
}

export default HomePageComponent
