import { useEffect, useState } from 'react'
import './App.css'
import { initKeycloak, getUser, login, logout } from './services/keycloakService'

function App() {
  const [initialized, setInitialized] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    initKeycloak().then((auth) => {
      setAuthenticated(auth)
      setInitialized(true)
      if (auth) setUser(getUser())
    })
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
      <p>Logged in as <strong>{user?.preferred_username}</strong></p>
      <div className="actions">
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  )
}

export default App