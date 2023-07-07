const Header = (props) => {
  return (
    <h1>{props.course}</h1>
  )
}

const Part = (props) => {
  return (
    <p>{props.part} {props.excercises}</p>
  )
}

const Content = (props) => {
  //Not a very beautiful way to do this X=/
  return (
    <>
      <Part part={props.courses[0].part} excercises={props.courses[0].excercises} />
      <Part part={props.courses[1].part} excercises={props.courses[1].excercises} />
      <Part part={props.courses[2].part} excercises={props.courses[2].excercises} />
    </>
  )
}

const Total = (props) => {
  return (
    <p>Number of exercises {props.excount}</p>
  )
}

var excount = 0

function myAdd(item) {
  excount += item.excercises 
}

const App = () => {
  const course = 'Half Stack application development'
  const courses = [
    { part: 'Fundamentals of React', excercises: 10 },
    { part: 'Using props to pass data', excercises: 7 },
    { part: 'State of a component', excercises: 14 }
  ]
  courses.forEach(myAdd)

  return (
    <div>
      <Header course={course} />
      <Content courses={courses} />
      <Total excount={excount} />
    </div>
  )
}

export default App