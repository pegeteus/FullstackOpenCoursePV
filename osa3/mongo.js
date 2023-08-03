const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://pvilpolafullstack:${password}@pegeteus.n6emr1z.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const generateId = () => {
    return Math.floor(Math.random() * 1000000)
}

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    id: Number,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3){
    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(person)
        })
        mongoose.connection.close()
    })
}
else if (process.argv.length === 5){
    const name = process.argv[3]
    const number = process.argv[4]

    const person = new Person({
        name: name,
        number: number,
        id: generateId(),
    })

    person.save().then(result => {
      console.log('person saved!')
      mongoose.connection.close()
    })    
}
else {
    console.log('Invalid arguments')
    process.exit(1)
}
