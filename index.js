const express = require('express')
let morgan = require('morgan')
const cors = require('cors')
const app = express()

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.use(cors())
morgan.token('body', (request) => JSON.stringify(request.body))

app.use(express.json())

app.use('/api/persons', morgan(':method :url :status :res[content-length] - :response-time ms :body', {
  skip: (request) => request.method !== 'POST'
}));



app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  const people = persons.length    
  const date = new Date().toLocaleString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  })
  
  const content = `
    <p>Phonebook has info for ${people} people</p>
    <p>${date}</p>
  `
  response.send(content)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.statusMessage ='Person not found'
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'Missing mandatory fields' 
    })
  }

  const personExists = persons.find(person => person.name === body.name)
  if (personExists) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  const person = {
    content: body.content,      
    id: Math.round(Math.random() * 1000),
    name: body.name,
    number: body.number
  }

  persons = [...persons, person]

  response.json(person)
})


const PORT = process.env.PORT || 4444
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
