import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'

function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Auth routes will be added here */}
        {/* Tourist routes will be added here */}
        {/* Guide routes will be added here */}
        {/* Admin routes will be added here */}
      </Routes>
    </div>
  )
}

export default App
