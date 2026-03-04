import { useEffect, useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import './App.css'
import { initKeycloak, getUser, login, logout } from './services/keycloakService'
import Hotel from './components/Hotel'
import Avis from './components/Avis'
import Employee from './components/Employee'

function App() {
  const [initialized, setInitialized] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const initialize = async () => {
      try {
        const auth = await initKeycloak()
        setAuthenticated(auth)
        setInitialized(true)
        if (auth) setUser(getUser())
      } catch (err) {
        console.error('Keycloak init error:', err)
        setInitialized(true)
      }
    }
    initialize()
  }, [])

  if (!initialized) return <div className="container">Loading authentication...</div>

  if (!authenticated) {
    return (
      <div className="container">
        <h1>React + Keycloak</h1>
        <p>You are not logged in.</p>
        <button onClick={login}>Login with Keycloak</button>
      </div>
    )
  }

  return (
    <div className="container">
      <h1>React + Keycloak</h1>
      <p>Logged in as <strong>{user?.preferred_username || 'Unknown User'}</strong></p>
      <div className="actions">
        <button onClick={logout}>Logout</button>
      </div>

      <nav>
        <Link to="/">Home</Link> | <Link to="/hotels">Hotels</Link> | <Link to="/avis">Avis</Link> | <Link to="/employees">Employees</Link>
      </nav>

      <Routes>
        <Route path="/" element={<h2>Welcome, select a page from the nav.</h2>} />
        <Route path="/hotels" element={<Hotel />} />
        <Route path="/avis" element={<Avis />} />
        <Route path="/employees" element={<Employee />} />
      </Routes>
    </div>
  )
}

export default App