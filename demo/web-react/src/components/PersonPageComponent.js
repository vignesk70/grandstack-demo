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
  Table,
  Dropdown,
  SelectPicker,
} from 'rsuite'
import Keycloak from 'keycloak-js'
import Logout from './LogoutComponent'
const { Column, HeaderCell, Cell } = Table
import 'rsuite/dist/styles/rsuite-default.css'
import { gql, useQuery } from '@apollo/client'

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

const GetData = () => {
  const { loading, error, data } = useQuery(GET_PERSON_NAMES)
  if (loading) {
    return 'error'
  }
  if (error) return 'error'

  if (data) {
    console.log('Neo4j data', data)
  }

  return (
    <>
      <Table height={400} data={data.people}>
        <Column width={200}>
          <HeaderCell>Name</HeaderCell>
          <Cell dataKey="name" />
        </Column>
        <Column width={200}>
          <HeaderCell>Reports to</HeaderCell>
          <Cell>
            {(rowData, rowIndex) => {
              return (
                <>
                  {rowData.reports_to.length > 0 ? (
                    <span key={rowIndex}>{rowData.reports_to[0].name}</span>
                  ) : (
                    <span key={rowIndex}></span>
                  )}
                </>
              )
            }}
          </Cell>
        </Column>
      </Table>
    </>
  )
}

function BuildDropdown() {
  const { loading, error, data } = useQuery(GET_PERSON_NAMES)
  const datatype = [
    {
      label: 'Monday',
      value: 'Monday',
      role: 'Master',
    },
    {
      label: 'Tuesday',
      value: 'Tuesday',
      role: 'Master',
    },
    {
      label: 'Wednesday',
      value: 'Wednesday',
      role: 'Master',
    },
    {
      label: 'Thursday',
      value: 'Thursday',
      role: 'Master',
    },
    {
      label: 'Friday',
      value: 'Friday',
      role: 'Master',
    },
    {
      label: 'Saturday',
      value: 'Saturday',
      role: 'Master',
    },
    {
      label: 'Sunday',
      value: 'Sunday',
      role: 'Master',
    },
  ]
  console.log('builddropdown', data)
  // data.people.map((item, index) => {
  //   console.log(item.name, index)
  //   datatype.push({ label: item.name, value: item.name, role: 'Master' })
  //   console.log(datatype)
  // })

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

      <SelectPicker
        placeholder="Select a person"
        data={datatype}
      ></SelectPicker>
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
      roles: null,
      user: null,
      authenticated: false,
    }
    this.close = this.close.bind(this)
    this.open = this.open.bind(this)
  }
  componentDidMount() {
    const keycloak = Keycloak('/keycloak.json')
    keycloak.init({ onLoad: 'login-required' }).then((authenticated) => {
      this.setState({
        keycloak: keycloak,
        authenticated: authenticated,
        role: keycloak.hasRealmRole('pgn_admin'),
        user: 'user1',
      })
      this.setState({ user: 'user2' })
      console.log(keycloak.hasRealmRole('pgn_admin'))
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
                {this.state.role}
                {/* <p>{this.state.keycloak.realmAccess.roles}</p> */}
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
                  <Modal.Title>Add Person</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {/* <PersonAdd props={this} /> */}
                  <Form>
                    <FormGroup>
                      <ControlLabel>Name</ControlLabel>
                      <FormControl name="name" />
                      <HelpBlock>Required</HelpBlock>
                    </FormGroup>
                    <FormGroup>
                      <ControlLabel>Select Manager</ControlLabel>
                      <BuildDropdown />
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
