import React from 'react'
import {
  Form,
  FormGroup,
  FormControl,
  HelpBlock,
  Button,
  ControlLabel,
  ButtonToolbar,
} from 'rsuite'

class PersonAddComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false,
    }
  }
  render() {
    return (
      <div>
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
          <FormGroup>
            <ControlLabel>Password</ControlLabel>
            <FormControl name="password" type="password" />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Textarea</ControlLabel>
            <FormControl rows={5} name="textarea" componentClass="textarea" />
          </FormGroup>
          <FormGroup>
            <ButtonToolbar>
              <Button appearance="primary">Submit</Button>
              <Button appearance="default" onClick={this.props.close}>
                Cancel
              </Button>
            </ButtonToolbar>
          </FormGroup>
        </Form>
      </div>
    )
  }
}

export default PersonAddComponent
