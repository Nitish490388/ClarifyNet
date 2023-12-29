import { useState } from 'react'
import Header from './components/Header'
import AllRoutes from './AllRoutes'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="__app bg-black text-white">
        <Header />
        <AllRoutes />

      </div>
    </>
  )
}

export default App
