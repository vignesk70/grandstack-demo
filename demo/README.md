
# Creating a React App with Grandstack
This is my log on creating a simple web application that utilises [grandstack.io](http://grandstack.io) to create a web application with React as the front end and that will connect to Neo4j at the backend.

Apollo and GraphQL will the bridge between front and back end.


# Background

In the current work landscape HR is undergoing a transition. Managers can have direct reports for reporting purposes but these direct reports also work with other Managers on projects and assignments.

We will create a simple application to allow us to define the operational reporting and then project assignments and the distribution of various tasks to individuals.

We will explore the ability to quickly query data providing comprehensive information regarding projects and possible workload distribution.


# Pre-requisite

**Neo 4j** - Neo4j is a graph database that stores information as nodes and relationships between the nodes. Nodes and Relationship can be assigned properties that provide detailed information about them. www.neo4j.com

**Nodejs** - NodeJS is the underlying javascript runtime library that powers the applications front end and backend. www.nodejs.org

**Grandstack** - a Framework to scaffold and application that provides a React front end and integration to Neo4j with Apollo and GraphQL API. www.grandstack.io


# Getting Started

## Neo4j - Graph data base model

First step is to model the data. Taking the business problem above the basic idea is to NOT think in terms of database tables and rows. Currently when looking at data to be stored we think of Excel or database to keep our data.

### Persons
| Person | Manager|Project|
|---|---|---|
|Jonathan Wright|James Wagner|Project A
|Chance Clarens| James Wagner|
|Brendan Armel|James Wagner|Project A|
|Alana Yezekael|Anna Elouan|Project A


### Project Managers
|Project Manager|Project
|---|---|
|Anna Elouan|Project A|

### Tasks Assignment
|Project|Task|Assignee|Effort Percent|
|---|---|--|----|
|Project A|Task 1|Brendan Armel|50
|Project A|Task 2|Jonathan Wright| 100
|Project A|Task 1|Jonathan Wright| 50
|Project A|Task 2|Alana Yezekael| 80
|Project A|Task 3||

Looking at the data above it is not an easy task to understand and view the relationships between projects, persons, managers and tasks. (imagine having a couple of thousand employees and hundreds of project. Visibility is greatly reduced with this view.

### Neo 4j - Welcome Graph Databases
I will not cover the details of a graph database but just introduce key concepts that we will use to model our database.
First thing first when working with a graph database, we need to be able to visualize data and  its "actual" relationships between two pieces of data. In Neo4j a **node** can represent an entity such as a Person, a Project, a Task and so on. And **relationships** describe how two nodes relate to each other. A node in neo4j is represented with a Label to indicate the type of node and properties for the node that describe details of the node.

**Node**
```
 (Person) - Label person
 (Person {name:"Brendan Armel"}) - Label with name attached
 ```

A relationship in neo4j specifies how two nodes are related which can be descriptive in nature. A relationship is directed when its created but can be traversed in any direction when queried. A relationship also can have properties to further describe a relationship.

**Relationship**
```
(Person)-[:REPORTS_TO]->(Person)

(Person)-[:REPORTS_TO {startDate:"2021-03-01"}]-(Person)
```

When we look at individuals, to model a reporting structure, we need to understand that in a reporting structure we have an individual REPORTS TO an individual. And we can have a hierarchy of individuals reporting to one or more individuals.
We can say that *Jonathan Wright Reports To James Wagner*.

In Neo4j please create a database and connect to it using the Neo4j Browser. You may refer to the documentation in Neo4j for that purpose.
Referring to the statement we can take our data above we can model it in neo4j is as follows:

```
MERGE (a:Person {name:"Jonathan Wright"})-[:REPORTS_TO]->(mgr1:Person {name:"James Wagner"})
MERGE (b:Person {name:"Chance Clarens"})-[:REPORTS_TO]->(mgr1)
MERGE (c:Person {name:"Brendan Armel"})-[:REPORTS_TO]->(mgr1)
MERGE (mgr2:Person {name:"Anna Elouan"})
MERGE (d:Person {name:"Alana Yezekael"})-[:REPORTS_TO]->(mgr2)
```


Once the data has been created we can execute a query to visualize the nodes and relationships  by selecting all nodes.

`MATCH (n) RETURN n`

![FIgure 1 ](https://grandstackdemo.oss-ap-southeast-3.aliyuncs.com/figure1.png)

The diagram above shows the managers and also the individuals reporting to them.

Now that we have the individuals created and reporting structure let us take a look at creating a project and some tasks.

```
MERGE (p:Project {name:"Project A"})
MERGE (t1:Task {name:"Task 1"})
MERGE (t2:Task {name:"Task 2"})
MERGE (t3:Task {name:"Task 3"})
MERGE (p)-[:HAS_TASK]->(t1)
MERGE (p)-[:HAS_TASK]->(t2)
MERGE (p)-[:HAS_TASK]->(t3)
```

Now we will use the same query to return all the nodes again as above

![Figure 2](https://grandstackdemo.oss-ap-southeast-3.aliyuncs.com/figure2.png)


Now in the next step let us assign individuals to tasks. We will create a relationship called ASSIGNED_TO between person and tasks.
```
//get the individuals

MATCH (p1:Person {name:"Jonathan Wright"})
MATCH (p2:Person {name:"Brendan Armel"})
MATCH (p3:Person {name:"Alana Yezekael"})
MATCH (p4:Person {name:"Anna Elouan"})

//get the tasks and project
MATCH (t1:Task {name:"Task 1"})
MATCH (t2:Task {name:"Task 2"})
MATCH (pr:Project {name:"Project A"})

//assign the task
MERGE (p1)-[:ASSIGNED_TO]->(t2)
MERGE (p2)-[:ASSIGNED_TO]->(t1)
MERGE (p3)-[:ASSIGNED_TO]->(t2)
MERGE (p1)-[:ASSIGNED_TO]->(t1)

//assign manager to project
MERGE (p4)-[:MANAGES]->(pr)
```


![Figure 3](https://grandstackdemo.oss-ap-southeast-3.aliyuncs.com/figure3.png)

With the diagram above now we can see assignment of individuals and graphically we can see individuals who are not assigned, tasks that are not assigned and tasks that have more than one assignee.

Now that we have a simple structure of project tasks and assignees let us try a few queries to understand the data.

Lets take a simple query to extract the data.
1. Find persons assigned to a Task
```
MATCH (p:Person)-[:ASSIGNED_TO]-(t:Task) RETURN t.name,collect(p.name)
```
|t.name	|collect(p.name)|
|---|---|
|"Task 1"|["Brendan Armel"]|
|"Task 2"|["Alana Yezekael", "Jonathan Wright"]|


2. Find tasks which have not been assigned
```
MATCH (p:Person)-[:ASSIGNED_TO]-(t:Task) RETURN t.name,collect(p.name)
```

|t||
|---|---|
|{"name":"Task 3"}||

3. Find different information with a single base query
```
MATCH (mgr:Person)-[:MANAGES]-> (project:Project)-[x:HAS_TASK]->(task:Task)<-[:ASSIGNED_TO]-(person:Person)-[:REPORTS_TO]->(rpt:Person)

```
The query above will not return anything unless we have a RETURN clause. This is where we can return different peices of information as we need.

Lets try it out with a few queries by appending the RETURN statment to the query above.

```
// return the number of tasks assigned to a person sorted by most assigned
RETURN person.name,count(x) as tasks ORDER BY tasks DESC

//return persons , managers and count of task per person
RETURN DISTINCT person.name,rpt.name,count(x)

```

As you can see that the queries can return information from any direction required.

As mentioned earlier we can also add properties to the relationships. So we will add some additional information to the **ASSIGNED_TO** where will add data on the amount of effort assigned to the task.


```
MATCH (p1:Person {name:"Jonathan Wright"})-[r1:ASSIGNED_TO]-(t1:Task {name:"Task 1"})
SET r1.effort=60;

MATCH (p1:Person {name:"Jonathan Wright"})-[r1:ASSIGNED_TO]-(t1:Task {name:"Task 2"})
SET r1.effort=90;

MATCH (p1:Person {name:"Brendan Armel"})-[r1:ASSIGNED_TO]-(t1:Task {name:"Task 2"})
SET r1.effort=50;

MATCH (p1:Person {name:"Alana Yezekael"})-[r1:ASSIGNED_TO]-(t1:Task {name:"Task 2"})
SET r1.effort=80;

````

We will use this data later in the demo.


## NodeJS
Now for the next part we will install NodeJS. If you already havent done so. Go to the [Nodejs](https://nodejs.org) and download the installer for your environment.

After installing you can verify your installation by typing the following.

```
~ » npm --version
7.19.1

~ » node --version
v16.1.0

~ » npx --version
7.19.1
```

## Grandstack
With that completed we can now install Grandstack to continue with the demo. Grandstack is a complete package that will use `npx` to download the necessary packages for us to continue. You can refer to the documentation for more information about Grandstack.

Lets start with the following in the command promp or explorer create a directory for us to have a working environment for the demo.

```
mkdir grandstack-demo
cd grandstack-demo
```

In the working directory lets install grandstack. Just follow the prompts and change details where necessary. For the Neo4j setup, the default user is `neo4j` and ensure that you enter the same password when you created your database otherwise you will not be able to connect to your database.

in your folder execute the following command to install grandstack.
```
npx create-grandstack-app demo
```

You should see the prompts and installation progress as below.


```
~/Documents/Development/grandstack-demo » npx create-grandstack-app demo
? Please choose which project template to use React
? Install dependencies? Yes
? Initialize a git repository? Yes
? Now let's configure your GraphQL API to connect to Neo4j. If you don't have a
Neo4j instance you can create one for free in the cloud at https://neo4j.com/san
dbox

Hit <Return> When you are ready.
? Enter the connection string for Neo4j
    (use neo4j+s:// or bolt+s:// scheme for encryption) bolt://localhost:7687
? Enter the Neo4j user neo4j
? Enter the password for this user asdfgh!23
Initializing Project...
  ✔ Create GRANDstack App
    ✔ Creating directory '/Users/vignes/Documents/Development/grandstack-demo/demo'
    ✔ Downloading latest release
    ✔ Extracting latest release
    ✔ Creating Local env file with configuration options...
    ✔ Creating scripts configuration...
    ✔ Removing unused templates:
       ✔ web-react-ts
       ✔ web-angular
       ✔ mobile_client_flutter
  ✔ Initialize git
  ✔ Installing Packages with npm
    ✔ Installing GRANDstack CLI and dependencies
    ✔ Installing api dependencies
    ✔ Installing web-react dependencies

Thanks for using GRANDstack! We've created your app in '/Users/vignes/Documents/Development/grandstack-demo/demo'
You can find documentation at: https://grandstack.io/docs


To start your GRANDstack web application and GraphQL API run:

        cd demo
        npm run start

Then (optionally) to seed the database with sample data, in the api/ directory in another terminal run:

        npm run seedDb

The default application is a simple business reviews application. Feel free to suggest updates by visiting the open source template repo and opening an issue: https://github.com/grand-stack/grand-stack-starter/issues.

```

Go into the directory `demo` that we just created and we should be able to see a structure similar to below.

![Figure 4](https://grandstackdemo.oss-ap-southeast-3.aliyuncs.com/figure4.png)


We can do a quick test to check if we can connect to the application. It wont show any data at the moment becuase the default application connects to a database structure which can be loaded by `npm run seedDb` which will populate the graph database that we just created. We are going to skip this part and move on to just testing if we can bring up two the React app and also connect to the Neo4j database.

```
~/Documents/Development/grandstack-demo » cd demo                                                                                                                              vignes@Vigs-MBP-M1
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
~/Documents/Development/grandstack-demo/demo(master*) » npm run start

> start
> node scripts/start-dev.js

22:28:05 api |
22:28:05 api | > grand-stack-starter-api@0.0.1 start:dev
22:28:05 api | > ./node_modules/.bin/nodemon --watch src --ext js,graphql --exec babel-node  src/index.js
22:28:05 api |
22:28:05 React |
22:28:05 React | > grand-stack-starter-web-react@0.0.1 start
22:28:05 React | > react-scripts start
22:28:05 React |
22:28:08 api | [nodemon] 1.19.4
22:28:08 api | [nodemon] to restart at any time, enter `rs`
22:28:08 api | [nodemon] watching dir(s): src/**/*
22:28:08 api | [nodemon] watching extensions: js,graphql
22:28:08 api | [nodemon] starting `babel-node src/index.js`
22:28:16 api | GraphQL server ready at http://0.0.0.0:4001/graphql
22:28:18 React | (node:80085) [DEP0148] DeprecationWarning: Use of deprecated folder mapping "./" in the "exports" field module resolution of the package at /Users/vignes/Documents/Development/grandstack-demo/demo/web-react/node_modules/postcss-safe-parser/node_modules/postcss/package.json.
22:28:18 React | Update this package.json to use a subpath pattern like "./*".
22:28:18 React | (Use `node --trace-deprecation ...` to show where the warning was created)
22:28:19 React | [HPM] Proxy created: /  -> http://localhost:4001/graphql
22:28:20 React | ℹ ｢wds｣: Project is running at http://192.168.0.147/
22:28:20 React | ℹ ｢wds｣: webpack output is served from
22:28:20 React | ℹ ｢wds｣: Content not from webpack is served from /Users/vignes/Documents/Development/grandstack-demo/demo/web-react/public
22:28:20 React | ℹ ｢wds｣: 404s will fallback to /
22:28:20 React | Starting the development server...
22:28:20 React |
22:28:51 React | Compiled successfully!
22:28:51 React |
22:28:51 React | You can now view grand-stack-starter-web-react in the browser.
22:28:51 React |
22:28:51 React |   Local:            http://localhost:3000
22:28:51 React |   On Your Network:  http://192.168.0.147:3000
22:28:51 React |
22:28:51 React | Note that the development build is not optimized.
22:28:51 React | To create a production build, use npm run build.
22:28:51 React |
```

In the output above you might notice that we have two ports that are now exposed `4001` and `3000`.
 1. `4001` The first gives us access to the GraphQL playground that allows us to query and manipulate the data.
 2. `3000` is the React Application that we will build.

In your browser connect to the following url to view your default Grandstack App. `http://localhost:3000`.
![Figure 5](https://grandstackdemo.oss-ap-southeast-3.aliyuncs.com/figure5.png)

Then open `http://localhost:4001/graphql` to view the GraphQL playground.
![Figure 6](https://grandstackdemo.oss-ap-southeast-3.aliyuncs.com/figure6.png)


If you can see the above then we are good to continue on. We will have to make some changes in GraphQl playground to provide a starting point for us to be able to query our database and view the data similar to what we did in the Neo4j Browswer

Next we will display the information in the React App within our developed user interface.


# Demo Applications
## Get our data
To get access to our data we will need to be able to tell GraphQL how to query our database with the correct structure of our graph database. in order to do this there is a very simple way to quickly prepare the schema with a script provided to update the existing configuration.

To see the current schema navigate to the following folder in our application and select the file `schema.graphql` that will contains the definition of our graph database. Currently from the image below it shows the schema of the demonstration database that comes wtih grandstack.

![Figure 7](https://grandstackdemo.oss-ap-southeast-3.aliyuncs.com/figure7.png)

To replace this with our own database that we created earlier we will need to run a script provided to replace this file. Make sure that

```
grandstack-demo/demo(master*) » npm run inferschema:write

> inferschema:write
> node scripts/inferSchema.js
```

If you get errors do double check if you have the correct password setup.

Open the `schema.graphql` file again and you should see our database schema reflected here.

![Figure 8](https://grandstackdemo.oss-ap-southeast-3.aliyuncs.com/figure8.png)

This schema will however NOT work wtih the latest Neo4j supported version (as of writing @neo4j/graphql v2.0.0 (alpha)). There are some migration taht we need to make to ensure that this schema will be supported by graphql.

We need to modify the type definition to support the latest version. The documentation for this can be found [here](https://neo4j.com/docs/graphql-manual/2.0/guides/migration-guide/).

Change `_id: Long!` to `_id: ID!`

Any reference to `@relation` has to be converted to `@relationship`.

All the `name:` in the relationships have to be change to `type:`


The section describing the relationship has to be changed to an interface.
```
type ASSIGNED_TO @relationship(name: "ASSIGNED_TO") {
  from: Person!
  to: Task!
  effort: Int!
}

replace with

interface AssignedTo {
   effort: [Int!]
}
```

Your type definition should look something like this (do comment out certain fields as below).

```
type Project {
   _id: ID!
   name: String!
   has_task: [Task] @relationship(type: "HAS_TASK", direction: OUT)
   personsManage: [Person] @relationship(type: "MANAGES", direction: IN)
}

type Task {
   _id: ID!
   name: String!
   projects: [Project] @relationship(type: "HAS_TASK", direction: IN)
   persons: [Person] @relationship(type: "ASSIGNED_TO", properties: "AssignedTo", direction: IN)
}

type Person {
   _id: ID!
   name: String!
   reports_to: [Person] @relationship(type: "REPORTS_TO", direction: OUT)
   assignedTask: [Task] @relationship(type: "ASSIGNED_TO", properties: "AssignedTo", direction: OUT)
   # ASSIGNED_TO_rel: [ASSIGNED_TO]
   manages: [Project] @relationship(type: "MANAGES", direction: OUT)
}

interface AssignedTo {
   effort: Int!
}

# type ASSIGNED_TO @relationship(name: "ASSIGNED_TO") {
#   from: Person!
#   to: Task!
#   effort: Int!
# }


```

If you have not started your servers. You can go to your `demo` folder and run the command `npm run start`.  Open up the browser with the GraphQL Playground. `http://localhost:4001/graphql` for the url.

Now we should be able to run a few queries and view the results from our database.

Lets look at querying a person and viewing the tasks and effort assigned to them.

```
{
  people (where:{name_CONTAINS:"Jon"}){
    name
    assignedTaskConnection{
      edges{
        effort
        node{
          name
        }
      }
    }
  }
}
```

![Figure 9](https://grandstackdemo.oss-ap-southeast-3.aliyuncs.com/figure9.png)

So now we have a working example of creating a schema quickly from our database and then connecting it via graphql to query the data. Later we will see ways to create and update data as well.

## Build our User interface
Now lets take a look at how we would implement a UI to display the data that we have stored in our database.
Some of the common information that we would like to display would relate to the following:
1. Staff
2. Reporting structure (Ops)
3. Reporting structure (Project)
4. Tasks and assignees
5. Effort loading for each Staff

I will not be developing a very fancy UI but probably sufficient enough to demonstrate how to display and update the data from our database.
I will be using [Rsuite](https://rsuitejs.com/) for this tutorial but obviously you can use Material or other UI Frameworks.

Let get started by first deleting all the files in the `src/component/` folder.

Modify you `App.js` with the code as below. We will create the files later.

```
// App.js
import React from 'react'

import { BrowserRouter as Router } from 'react-router-dom'

import Main from './components/MainComponent'

export default function App() {
  return (
    <Router>
      <div>
        <Main />
      </div>
    </Router>
  )
}

```

Create a new file in the folder `src/MainComponent.js` and fill this up as a structure of the website.

```
import React, { Component } from 'react'
import 'rsuite/dist/styles/rsuite-default.css'
import { Container, Header, Content, Footer } from 'rsuite'
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom'
import HomePage from './HomePageComponent'
import HeaderComponent from './HeaderComponent'
import FooterComponent from './FooterComponent'

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

```

Create next file in the source folder `src/HeaderComponent.js`
```
import React, { Component } from 'react'
import 'rsuite/dist/styles/rsuite-default.css'
import { Nav, Icon, Navbar } from 'rsuite'

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
                <Nav.Item icon={<Icon icon="home" />}>Home</Nav.Item>
                <Nav.Item>Personnel</Nav.Item>
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

```

Create next file in the source folder `src/HomeComponent.js`

```
import React, { Component } from 'react'
import { Container, FlexboxGrid } from 'rsuite'

class HomePageComponent extends Component {
  render() {
    return (
      <div>
        <Container className="container">
          <FlexboxGrid justify="center" align="middle">
            <FlexboxGrid.Item colspan={10}>
              <div style={{ lineHeight: 20 }}>Content</div>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={10}>This is my content</FlexboxGrid.Item>
          </FlexboxGrid>
        </Container>
      </div>
    )
  }
}

export default HomePageComponent

```

Create next file in the source folder `src/FooterComponent.js`

```
// FooterComponent.js
import React, { Component } from 'react'
import { Container, FlexboxGrid } from 'rsuite'

class FooterComponent extends Component {
  render() {
    return (
      <div>
        <Container>
          <FlexboxGrid justify="center">
            Copyright 2021 Tunjang Jaya Graftek
          </FlexboxGrid>
        </Container>
      </div>
    )
  }
}

export default FooterComponent
```

Again make sure your server is running (`npm run start`) and browse to `http://localhost:3000` to view your page.

You should see something like this.
![Figure 10](https://grandstackdemo.oss-ap-southeast-3.aliyuncs.com/figure10.png)

Now lets add some content to be displayed in the Content Area

For the main page i am going to display a simple summary dashboard showing the counts of staff and tasks by projects.

Update the `src/HomePageComponent.js` as follows.
```
import React, { Component } from 'react'
import { Container, FlexboxGrid, Panel, Grid, Row, Col } from 'rsuite'

class HomePageComponent extends Component {
  render() {
    return (
      <div>
        <Container className="container">
          <FlexboxGrid justify="center" align="middle">
            <FlexboxGrid.Item colspan={10}>
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
                    <h2> 8</h2>
                    <p>
                      <small>Number of staff in the organization.</small>
                    </p>
                  </Panel>
                </Panel>
              </div>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={10}>
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
                          <h2>2</h2>
                          Projects
                        </div>
                      </Col>
                      <Col xs={12}>
                        <div className="show-col">
                          <h2>21</h2>
                          Tasks
                        </div>
                      </Col>
                    </Row>
                  </Grid>

                  <p>
                    <small>Count of Projects.</small>
                  </p>
                </Panel>
              </Panel>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </Container>
      </div>
    )
  }
}

export default HomePageComponent

```
You should now have a view as follows.

![Figure 11](https://grandstackdemo.oss-ap-southeast-3.aliyuncs.com/figure11.png)


## Getting Data from Neo4j
For the next step we will try to get the values from the Neo4j database to populate the counts. If you remember earlier we created a schema.graphql to setup the overall structure of the database.

In order to get custom data we will need to modify the schema to be able to return spefic query results. In our sample we will be returning an Integer value.

Lets add some custom queries to our `schema.graphql` file to enable us to do this.

Add the code below to the end of the schema file. This will create a Query type that allows us to define custom queries using `@cypher`.

```
type Query {
  personCount: Int
    @cypher(
      statement: """
      MATCH (p:Person) RETURN count(p) as persons
      """
    )
  projectCount: Int
    @cypher(
      statement: """
      MATCH (t:Project) RETURN count(t) as projects
      """
    )
  taskCount: Int
    @cypher(
      statement: """
      MATCH (t:Task) RETURN count(t) as tasks
      """
    )
}

```

This will provide additional queries available to GraphQl to be able to server data which in just an Integer to display the counts.

In order to use this we will update our `src/component/HomeComponent.js` and all two more components to display the data.

Update `HomeComponent.js` with the following:
```
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

```

Add a new file `src/components/PersonCountComponent.js` with the following:
```
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

```

Add a new component `src/component/ProjectCountComponent.js` with the following:
```
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

```

Once you have cmopleted that you should be able to view the actual results of waht is stored from your Neo4j database.

## Listing and adding / updating database
Great now that we can query the database lets try other common actions that one would normally do which is to provide a list of data and also a simple part to add a new node to the database.

For this lets create a new component that would give us an interface to display a list of persons and method to add a new person to the database.

Lets create a page to first display a list of names from our database.

Create a new component `PersonPageComponent.js` that will be as follows. The component will query the database and return a list of names and display it on the page.

```
import React, { Component } from 'react'
import { Container, FlexboxGrid, List } from 'rsuite'
import { gql, useQuery } from '@apollo/client'

const GET_PERSON_NAMES = gql`
  {
    people {
      name
    }
  }
`
const GetData = () => {
  const { loading, error, data } = useQuery(GET_PERSON_NAMES)
  if (loading) {
    return 'error'
  }
  if (error) return 'error'
  console.log(data)
  return (
    <>
      {data.people.map((item, index) => (
        <List.Item key={index} index={index}>
          {item.name}
        </List.Item>
      ))}
    </>
  )
}

export default class PersonPageComponent extends Component {
  render() {
    return (
      <div>
        <h1>Persons</h1>
        <Container>
          <FlexboxGrid justify="center">
            <FlexboxGrid.Item colspan={20}>
              <List>
                <GetData />
              </List>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </Container>
      </div>
    )
  }
}

```

Then lets modify our `HeaderComponent.js` to setup some menus that will be able to navigate between pages.

```
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

```

Then lets modify our `MainComponent.js` to display the page.

```
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
```

With thoses file create and updated we should be able to now navigate between pages and also get a listing of names of Persons in our database in the Personnel page.

### Keycloak

One of the areas that we should inmplement is to establish securtiy to protect sensitive information. A great tool used for an open source authentication and authorization tool is [Keycloak](https://www.keycloak.org).

Simplest way to establish this is to use Docker to simplify the installation and implementation. Visit [Keycloak Docker](https://www.keycloak.org/getting-started/getting-started-docker) for instructions. I will not be covering the Docker setup/installation but will show you how to basically setup Keycloak to protect a resource. Once you have Keycloak running configure your admin login and bring up the Administration Console.

![Figure 12](https://grandstackdemo.oss-ap-southeast-3.aliyuncs.com/Figure12.png)

In the Administration Console the first thing you need to do is to create a new Realm.

![Figure 13](https://grandstackdemo.oss-ap-southeast-3.aliyuncs.com/Figure13.png)

My reference is https://scalac.io/blog/user-authentication-keycloak-1/


Setup a Name for the Realm and save the details. You can use the default for this purpose.

Next would be to create a user. Click on the User menu on the left and enter a Username. Then click save and go the Credentials tab at the top and enter a password. Disabling the Temporary option for our use case. Accept the pop-up and were done creating a user.

IMAGE GOES HERE
![Figure 14](https://grandstackdemo.oss-ap-southeast-3.aliyuncs.com/Figure14.png)

The next step would be to define a client that will indicate the application that will connect to Keycloak for authentication. We will setup a new client for this.
Click on the Clients menu on the left.

![Figure 15](https://grandstackdemo.oss-ap-southeast-3.aliyuncs.com/Figure15.png)

Upon creating the client you will be redirected to the details page. For our purpose we will use the default options. For more complex scenarios you will want to fine tune your options.

![Figure 16](https://grandstackdemo.oss-ap-southeast-3.aliyuncs.com/Figure16.png)

The client Installation tab contains the configuration that we will use when we connect through React to secure our application. We will come back to this point after we have setup our React app.

![Figure 17](https://grandstackdemo.oss-ap-southeast-3.aliyuncs.com/Figure17.png)

For the React App to use keycloak we will use the keycloak javascript library to authenticate. We will install the following with `npm install keycloak-js --save`.

With that we can modify a page where we want to authenticate first before we display the information. We will update the `PersonPageComponent.js `that displays individual names to be a protected resource that requires authentication.

Modify the `PersonPageComponent.js ` by performing an import of  `Keycloak` and updating the `PersonPageComponent` component by using the `componentDidMount() ` to load the Keycloak object.


```
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

```

We will add another component for handling a logout as well. Create a `LogoutComponent.js` file in our components directory.

```
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

class Logout extends Component {
  logout() {
    this.props.history.push('/')
    this.props.keycloak.logout()
  }

  render() {
    return <button onClick={() => this.logout()}>Logout</button>
  }
}
export default withRouter(Logout)

```


To get this all to work we need to create a `keycloak.json` file with the contents of the Installation folder from the client page in Keycloak. Store this file in the `pubclic` folder of our application.

![Figure 18](https://grandstackdemo.oss-ap-southeast-3.aliyuncs.com/Figure18.png)



With that in place we can start our application with `npm run start` and open the browser. We should be seeing the dashboard on the browser but clicking on the `Personnel` link will bring up the login screen for Keycloak.


![Figure 19](https://grandstackdemo.oss-ap-southeast-3.aliyuncs.com/Figure19.png)

Enter the username and password for the user we created earlier and sign in. This will then allow us to display the Person page.

This is a very simple implementation of Keycloak which actually restricts utilization at the component level. We can configure Keycloak to protect fields and so on which we will not cover in this tutorial.


### Adding Data
Adding data to the graph is the next part that we will cover in this tutorial. We have already created a modal pop-up for adding data in the previous updated `PersonPageComponent.js` file.






















