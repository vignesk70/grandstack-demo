import React from 'react'
import { useQuery, gql } from '@apollo/client'
import { Panel, Grid, Row, Col } from 'rsuite'

const GET_PROJECT_COUNT = gql`
  {
    projectCount
  }
`
const GET_TASK_COUNT = gql`
  {
    taskCount
  }
`

function RenderTaskCount() {
  const { loading, error, data } = useQuery(GET_TASK_COUNT)
  console.log(data)
  if (error) return <p>Error</p>
  if (loading) return <p>Loading</p>
  return <>{data.taskCount}</>
}

function RenderProjectCount() {
  const { loading, error, data } = useQuery(GET_PROJECT_COUNT)
  console.log(data)
  if (error) return <p>Error</p>
  if (loading) return <p>Loading</p>
  return <>{data.projectCount}</>
}

export default function ProjectCount() {
  return (
    <React.Fragment>
      <div>
        <Panel
          shaded
          bordered
          bodyFill
          style={{
            display: 'inline-block',
            width: 240,
            margin: '1rem',
          }}
        >
          <h5>Projects/Tasks</h5>
          <Panel header="Projects/Tasks: ">
            <Grid fluid>
              <Row gutter={16}>
                <Col xs={12}>
                  <div className="show-col">
                    <h2>
                      <RenderProjectCount />
                    </h2>
                    Projects
                  </div>
                </Col>
                <Col xs={12}>
                  <div className="show-col">
                    <h2>
                      <RenderTaskCount />{' '}
                    </h2>
                    Tasks
                  </div>
                </Col>
              </Row>
            </Grid>

            <p>
              <small>Count of Projects and Tasks.</small>
            </p>
          </Panel>
        </Panel>
      </div>
    </React.Fragment>
  )
}
