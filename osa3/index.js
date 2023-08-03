const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.static('build'))

morgan.token('body', function(req, res) {
    return JSON.stringify(req.body);
});

let persons = [
    {
        "persons":[
            { 
            "name": "Arto Hellas", 
            "number": "040-123456",
            "id": 1
            },
            { 
            "name": "Ada Lovelace", 
            "number": "39-44-5323523",
            "id": 2
            },
            { 
            "name": "Dan Abramov", 
            "number": "12-43-234345",
            "id": 3
            },
            { 
            "name": "Mary Poppendieck", 
            "number": "39-23-6423122",
            "id": 4
            }
        ]
    }
]

let phonebook = persons[0].persons

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  res.json(phonebook)
})

app.get('/info', (req, res) => {
    const personsCount = JSON.stringify(phonebook.length)
    let date_ob = new Date
    res.send("<p>Phonebook has info for "+personsCount+" people</p><br /><p>"+date_ob+"</p>")
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = phonebook.find(person => person.id === id)
    
    if (person) {    
        response.json(person)  
    } 
    else {    
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log('poitettava id on: ' + id)
    phonebook = phonebook.filter(person => person.id !== id)
  
    response.status(204).end()
})

const generateId = () => {
    return Math.floor(Math.random() * 1000000)
}
  
app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({ 
        error: 'Person info must contain both name and number.' 
        })
    }

    if (phonebook.filter(person => person.name === body.name).length > 0){
        return response.status(400).json({ 
            error: 'Phonebook already contains info for given name.' 
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    phonebook = phonebook.concat(person)

    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})