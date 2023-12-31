import { useState } from 'react'
import Header from './components/Header'
import AllRoutes from './AllRoutes'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="__app bg-black text-white">
        <Header />
        <AllRoutes />

      </div>
    </>
  )
}

export default App
