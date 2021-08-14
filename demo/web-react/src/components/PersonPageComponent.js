import React, { Component } from 'react'
import {
  Container,
  FlexboxGrid,
  List,
  Button,
  Modal,
  Form,
  FormGroup,
  FormControl,
  HelpBlock,
  ControlLabel,
  ButtonToolbar,
  Dropdown,
  Table,
} from 'rsuite'
import Keycloak from 'keycloak-js'
import Logout from './LogoutComponent'
const { Column, HeaderCell, Cell } = Table

import { gql, useQuery } from '@apollo/client'
// import PersonAdd from './PersonAddComponent'

const GET_PERSON_NAMES = gql`
  {
    people {
      name
      reports_to {
        name
      }
    }
  }
`

function testdata(data) {
  console.log('testdata', data)
  return <p>this istest </p>
}
const GetData = () => {
  const { loading, error, data } = useQuery(GET_PERSON_NAMES)
  if (loading) {
    return 'error'
  }
  if (error) return 'error'

  if (data) {
    console.log('Neo4j data', data)
    // console.log('state', props.state.personData)
    // props.setState({ personData: data })
    // this.setState({ props.personData: data })
  }

  return (
    <>
      {data.people.map((item, index) => (
        <List.Item key={index} index={index}>
          <p className="strong">{item.name}</p>
          {item.reports_to.length > 0 &&
            item.reports_to.map((rep, index) => <p key={index}>{rep.name}</p>)}
        </List.Item>
      ))}
      <Table data={data.people}>
        <Column width={200}>
          <HeaderCell>Name</HeaderCell>
          <Cell dataKey="name" />
        </Column>
        <Column width={200}>
          <HeaderCell>Reports to</HeaderCell>
          <Cell dataKey="reports_to[0]['name']">{testdata({ data })}</Cell>
        </Column>
      </Table>
    </>
  )
}

function BuildDropdown() {
  const { loading, error, data } = useQuery(GET_PERSON_NAMES)
  if (loading) {
    return 'error'
  }
  if (error) return 'error'

  if (data) {
    console.log('this data', data)
  }
  return (
    <>
      <Dropdown title="Person" style={{ width: '240px' }}>
        {data.people.map((item, index) => (
          <Dropdown.Item key={index}>{item.name}</Dropdown.Item>
        ))}
      </Dropdown>
    </>
  )
}

export default class PersonPageComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false,
      personData: [],
      keycloak: null,
      authenticated: false,
    }
    this.close = this.close.bind(this)
    this.open = this.open.bind(this)
  }
  componentDidMount() {
    const keycloak = Keycloak('/keycloak.json')
    keycloak.init({ onLoad: 'login-required' }).then((authenticated) => {
      this.setState({ keycloak: keycloak, authenticated: authenticated })
    })
  }
  close() {
    console.log('close')
    this.setState({ show: false })
  }
  open() {
    console.log('open')
    this.setState({ show: true })
  }

  render() {
    if (this.state.keycloak) {
      if (this.state.authenticated)
        return (
          <div>
            <Container>
              <FlexboxGrid>
                <h1>Persons</h1>
              </FlexboxGrid>

              <FlexboxGrid justify="center">
                <FlexboxGrid.Item colspan={20}>
                  <List>
                    <GetData props={this} />
                  </List>
                </FlexboxGrid.Item>
              </FlexboxGrid>
              <FlexboxGrid
                justify="center"
                className="button-margin"
                style={{ marginTop: '20px' }}
              >
                <FlexboxGrid.Item>
                  <Button appearance="default" onClick={this.open}>
                    {' '}
                    Add Person{' '}
                  </Button>
                  <Logout keycloak={this.state.keycloak} />
                </FlexboxGrid.Item>
              </FlexboxGrid>
              <Modal show={this.state.show} onHide={this.close}>
                <Modal.Header>
                  <Modal.Title>Modal Title</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {/* <PersonAdd props={this} /> */}
                  <Form>
                    <FormGroup>
                      <ControlLabel>Username</ControlLabel>
                      <FormControl name="name" />
                      <HelpBlock>Required</HelpBlock>
                    </FormGroup>
                    <FormGroup>
                      <ControlLabel>Email</ControlLabel>
                      <FormControl name="email" type="email" />
                      <HelpBlock tooltip>Required</HelpBlock>
                    </FormGroup>
                    <BuildDropdown />
                    <FormGroup>
                      <ControlLabel>Password</ControlLabel>
                      <FormControl name="password" type="password" />
                    </FormGroup>
                    <FormGroup>
                      <ControlLabel>Textarea</ControlLabel>
                      <FormControl
                        rows={5}
                        name="textarea"
                        componentClass="textarea"
                      />
                    </FormGroup>
                    <FormGroup>
                      <ButtonToolbar>
                        <Button appearance="primary">Submit</Button>
                        <Button appearance="default" onClick={this.close}>
                          Cancel
                        </Button>
                      </ButtonToolbar>
                    </FormGroup>
                  </Form>
                </Modal.Body>
              </Modal>
            </Container>
          </div>
        )
      else return <div>Unable to authenticate!</div>
    }
    return <div>Initializing Keycloak...</div>
  }
}
