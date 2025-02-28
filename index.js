require('dotenv').config()
const express = require('express')
let morgan = require('morgan')
const cors = require('cors')
const app = express()
const Phonebook = require('./models/phonebook')

app.use(cors())
app.use(express.static('dist'))
morgan.token('body', (request) => JSON.stringify(request.body))

app.use(express.json())

app.use('/api/persons', morgan(':method :url :status :res[content-length] - :response-time ms :body', {
  skip: (request) => request.method !== 'POST'
}));



app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
})

app.get('/api/persons', (request, response) => {  
  Phonebook.find({}).then(result => {
    response.json(result)
  })
})

app.get('/info', (request, response) => {
  Phonebook.find({}).then(phonebook => {
    const count = phonebook.length
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
      <p>Phonebook has info for ${count} people</p>
      <p>${date}</p>
    `
    response.send(content)
  })  
})

app.get('/api/persons/:id', (request, response, next) => {
  Phonebook.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.statusMessage ='Person not found'
      response.status(404).end()
    }
  })
  .catch(error => next(error))
  
  
})

app.delete('/api/persons/:id', (request, response, next) => {
  Phonebook.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const { name, phone } = request.body;

  const newPerson = new Phonebook({
    name: name,
    number: phone
  });
     
  newPerson.save().then(result => {
    response.json(result)
  })
  .catch(error => next(error))
  
})

app.put('/api/persons/:id', (request, response, next) => {
  const {name, phone} = request.body
  const number = phone
  Phonebook.findByIdAndUpdate(
    request.params.id, 
    {name,number}, 
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatePhonebook => {
      response.json(updatePhonebook)
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT || 4444
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
