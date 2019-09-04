const express = require('express')
const morgan = require('morgan')

const server = express()

server.use(express.json())
server.use(morgan('dev'))

const projects = []

let requests = 0

server.use((req, res, next) => {

  requests += 1
  console.log('requests', requests)
  next()
  
})

function checkProject(req, res, next) {
  const { id } = req.params

  if(!projects[id]){
    return res.status(400).json({
      message: 'project not found!'
    })
  }

  return next()

}

server.get('/projects', (req, res) => {
    res.json(projects)
})

server.post('/projects', (req, res) => {

  const project = req.body
  projects.push(project)

  res.json(projects)

})

server.post('/projects/:id/tasks', checkProject, (req, res) => {

  const { id } = req.params
  const { title } = req.body
  projects[id].tasks.push(title)

  res.json(projects)

})

server.put('/projects/:id', checkProject,  (req, res) => {

  const { id } = req.params
  const project = req.body
  projects[id] = project

  res.send(projects)

})

server.delete('/projects/:id', checkProject,(req, res) =>{

  const { id } = req.params
  projects.splice(id, 1)

  res.status(201).send()

})


server.listen(3000, () => console.log("Server is On"))