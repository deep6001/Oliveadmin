import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import BuyerData from './components/Admin'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App h-screen w-full ">
      <BuyerData/>
      
    </div>
  )
}

export default App
