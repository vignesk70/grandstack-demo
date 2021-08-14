import React from 'react'
import { useQuery, gql } from '@apollo/client'
import { Panel } from 'rsuite'

const GET_PERSON_COUNT = gql`
  {
    personCount
  }
`

export default function RatingsChart() {
  const { loading, error, data } = useQuery(GET_PERSON_COUNT)
  if (error) return <p>Error</p>
  if (loading) return <p>Loading</p>

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
          <h5>Workforce</h5>
          <Panel header="Number of Staff">
            <h2>{data.personCount}</h2>

            <p>
              <small>Number of staff in the organization.</small>
            </p>
          </Panel>
        </Panel>
      </div>
    </React.Fragment>
  )
}
