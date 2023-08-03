const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
require('dotenv').config()
const Person = require('./models/person')
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.static('build'))

morgan.token('body', function(req, res) {
    return JSON.stringify(req.body);
});

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    }
  
    next(error)
}
  
// tämä tulee kaikkien muiden middlewarejen rekisteröinnin jälkeen!
app.use(errorHandler)

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(phonebook => {
      response.json(phonebook)
    })
})

app.get('/info', (req, res) => {
    Person.find({}).then(phonebook => {
        const personsCount = JSON.stringify(phonebook.length)
        let date_ob = new Date
        res.send("<p>Phonebook has info for "+personsCount+" people</p><br /><p>"+date_ob+"</p>")
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
      .then(result => {
        response.status(204).end()
      })
      .catch(error => next(error))
  })

const generateId = () => {
    return Math.floor(Math.random() * 1000000)
}

app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (body.name === undefined || body.number === undefined) {
      return response.status(400).json({ error: 'name or number missing' })
    }
 
    const person = new Person({
        name: body.name,
        number: body.number,
        id: generateId(),
    })
  
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
  
    const person = new Person({
        name: body.name,
        number: body.number,
        id: body._id,
        _id: body._id,
    })

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})