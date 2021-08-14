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
} from 'rsuite'
import { gql, useQuery } from '@apollo/client'
// import { Formik, Field, Form } from 'formik'
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
const GetData = (props) => {
  const { loading, error, data } = useQuery(GET_PERSON_NAMES)
  if (loading) {
    return 'error'
  }
  if (error) return 'error'

  if (data) {
    console.log('neo4j data', data, props)
    props.setState({ personData: data })
    // this.setState({ props.personData: data })
  }
  return (
    <>
      {data.people.map((item, index) => (
        <List.Item key={index} index={index}>
          {item.name}
          {item.reports_to.name}
        </List.Item>
      ))}
    </>
  )
}

export default class PersonPageComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false,
      personData: [],
    }
    this.close = this.close.bind(this)
    this.open = this.open.bind(this)
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
            </FlexboxGrid.Item>
          </FlexboxGrid>
          <Modal show={this.state.show} onHide={this.close}>
            <Modal.Header>
              <Modal.Title>Modal Title</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {/* <PersonAdd props={this} /> */}
              {/* <Formik
                initialValues={{
                  name: '',
                  manager: '',
                }}
              > */}
              <Form>
                <FormGroup>
                  <ControlLabel>Names</ControlLabel>
                  <FormControl name="name" />
                  <HelpBlock>Required</HelpBlock>
                </FormGroup>
                <FormGroup>
                  <ControlLabel>Email</ControlLabel>
                  <FormControl name="email" type="email" />
                  <HelpBlock tooltip>Required</HelpBlock>
                </FormGroup>
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
              {/* </Formik> */}
            </Modal.Body>
          </Modal>
        </Container>
      </div>
    )
  }
}
