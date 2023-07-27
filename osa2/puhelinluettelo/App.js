import './App.css';
import { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = (props) => {
  const value = props.value
  const onChange = props.onChange

  return (
    <div>
          filter shown with <input value={value} onChange={onChange} />
    </div>
  )
}

const PersonForm = (props) => {
  const addName = props.addName
  const newName = props.newName
  const handleNameChange = props.handleNameChange
  const newNumber = props.newNumber
  const handleNumberChange = props.handleNumberChange

  return (
    <form onSubmit={addName}>
      <div>
        name: <input 
          value={newName}
          onChange={handleNameChange}
          />
      <div>
        number: <input 
          value={newNumber}
          onChange={handleNumberChange}
          />
      </div>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = (props) => {
  const personsToShow = props.personsToShow

  if (personsToShow.length === 0){
    return (<p>No persons found matching the search filter</p>)
  }

  return (
       <ul>
          {personsToShow.map(person => 
            <li key={person.name}>{person.name} {person.number}</li>)}
       </ul>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameSearch, setNameSearch] = useState('')

  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }, [])

  const personsToShow = nameSearch === "" ? persons : 
   persons.filter(person => person.name.toLowerCase().includes(nameSearch.toLowerCase()))

  const addName = (event) =>{
    event.preventDefault()

    //if there is to be found given name already
    if (persons.map(person => person.name).includes(newName)){
      alert(`${newName} is already added to phonebook`)
      return
    }

    setPersons(persons.concat({ name: newName, number: newNumber}))
    setNewName('')
    setNewNumber('')
  }
  
  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleNameSearchChange = (event) => {
    console.log(event.target.value)
    setNameSearch(event.target.value)
  }

  console.log('Shown persons are ', personsToShow)

  return (
    <div>
      <h2>Phonebook</h2>
        <Filter value = {nameSearch} onChange = {handleNameSearchChange} />
      <h2>add a name</h2>
        <PersonForm 
          addName = {addName}
          newName = {newName}
          handleNameChange = {handleNameChange}
          newNumber = {newNumber}
          handleNumberChange = {handleNumberChange}
        />
      <h2>Numbers</h2>
        <Persons personsToShow={personsToShow} />
    </div>
  )
}

export default App
