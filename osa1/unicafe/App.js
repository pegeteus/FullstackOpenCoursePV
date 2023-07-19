import { useState } from 'react'

const StatisticLine = (props) => {
  if (props.addPercent) {
    return (<tr><td>{props.text}</td><td>{props.value} %</td></tr>)
  }
  return (<tr><td>{props.text}</td><td>{props.value}</td></tr>)
}

const Statistics = (props) => {
  if (props.value[3] === 0){
    return (
      <div>No feedback given</div>
    )
  }
  return (
    <div>
      <table>
        <StatisticLine text="good" value={props.value[0]} />
        <StatisticLine text="bad" value={props.value[1]} />
        <StatisticLine text="all" value={props.value[2]} />
        <StatisticLine text="average" value={(props.value[0]*1+props.value[2]*(-1))/props.value[3]}/>
        <StatisticLine text="gopositive" addPercent={true} value={(props.value[0]/(props.value[0]+props.value[1]+props.value[2]))*100 }/>
      </table>
    </div>
  )
}


const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <p>
        <h1>give feedback</h1>
        <Button handleClick={() => setGood(good + 1)} text="good" />
        <Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />
        <Button handleClick={() => setBad(bad + 1)} text="bad" />
      </p>
      <p>
        <h1>statistics</h1>
        <Statistics value={[good, neutral, bad, good+neutral+bad]} />
      </p>
    </div>
  )
}

export default App