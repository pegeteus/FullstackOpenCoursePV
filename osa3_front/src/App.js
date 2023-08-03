import './App.css';
import './index.css';
import { useState, useEffect } from 'react'
import personService from './services/persons'

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
  console.log('now on Persons method, delete method is ', props.deletePerson)
  const personsToShow = props.personsToShow
  const deletePerson = props.deletePerson

  if (personsToShow.length === 0){
    return (<p>No persons found matching the search filter</p>)
  }

  return (
       <ul>
          {personsToShow.map(person => 
            <li key={person.name}>{person.name} {person.number} 
              <button onClick={() => deletePerson(person.id)}>delete</button>
            </li>)}
       </ul>
  )
}

const Notification = ({ message, isError }) => {
  if (message === null) {
    return null
  }

  if (isError){
    isError = false
    return (
      <div className="error">
        {message}
      </div>
    )
  }

  return (
    <div className="notification">
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [personToDelete, setPersonToDelete] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameSearch, setNameSearch] = useState('')
  const [notification, setNotification] = useState(null)
  const [isError, setIsError] = useState('false')

  //read persons data from server
  useEffect(() => {
    personService
      .getAll()
        .then(initialPersons => {        
          setPersons(initialPersons)      
        })
        .catch(error => {
          alert('failed to read initialization data')
        })
  }, [])

  const personsToShow = nameSearch === "" ? persons : 
   persons.filter(person => person.name.toLowerCase().includes(nameSearch.toLowerCase()))

  const addName = (event) =>{
    event.preventDefault()

    //if there is to be found given name already
    if (persons.map(person => person.name).includes(newName)){

      if (!window.confirm(`${newName} is already added to phonebook. Do you want to replace number of the original?`)){
        setNotification(`${newName} is already added to phonebook.`)
        setIsError(true)
        return
      }

      const personToUpdate = persons.find(p => p.name === newName)
      setNotification(`Updated number info of ${newName}`)
      setIsError(false)

      personService
        .update(personToUpdate.id,{ name: newName, number: newNumber, _id: personToUpdate.id})
          .then(returnedPerson => {  
            setPersons(persons.filter(p => p.name !== newName).concat(returnedPerson))  
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            console.log(error)
            setIsError(true)
            setNotification('failed to add new person info to server')
          })

      return
    }

    setNotification(`Added ${newName}`)
    setIsError(false)

    //add new person info to server
    personService
      .create({ name: newName, number: newNumber})
        .then(returnedPerson => {        
          setPersons(persons.concat(returnedPerson))        
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          setIsError(true)
          setNotification('failed to add new person info to server')
        })
  }

  // delete person info from server
  const deletePerson = (persontodelete) =>{
    const personToDeleteName = persons.find(p => p.id === persontodelete).name
    console.log('person to delete info: ', personToDeleteName, persontodelete)

    if (!window.confirm(`Do you really want to remove person ${personToDeleteName}`)){
      setNotification(null)
      console.log(`Deletion of ${personToDeleteName} canceled`)
      return
    }

    console.log('Now will try to delete person ', personToDeleteName)
    setPersonToDelete(persontodelete)
    setNotification(`Deleted ${personToDeleteName}`)
    setIsError(false)

    personService
      .deletedata(personToDelete)
        .then(response => {
          console.log(response)
          setPersons(persons.filter(p => p.id !== personToDelete))
          setPersonToDelete('')
        })
        .catch(error => {
          setIsError(true)
          setNotification('failed to delete person info to server')
        })
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

  return (
    <div>
      <h2>Phonebook</h2>
        <Filter value = {nameSearch} onChange = {handleNameSearchChange} />
      <h2>add a name</h2>
        <Notification message={notification} isError={isError}/>
        <PersonForm 
          addName = {addName}
          newName = {newName}
          handleNameChange = {handleNameChange}
          newNumber = {newNumber}
          handleNumberChange = {handleNumberChange}
        />
      <h2>Numbers</h2>
        <Persons personsToShow={personsToShow} deletePerson={deletePerson} />
    </div>
  )
}

export default App
