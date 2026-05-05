import { createContext, useContext, useEffect, useState } from 'react'
import { getProfile, getStoredToken, setStoredToken } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getStoredToken())
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadProfile() {
      if (!token) {
        if (active) {
          setUser(null)
          setLoading(false)
        }
        return
      }

      try {
        const profile = await getProfile()
        if (active) {
          setUser(profile)
        }
      } catch (error) {
        setStoredToken(null)
        if (active) {
          setToken(null)
          setUser(null)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadProfile()
    return () => {
      active = false
    }
  }, [token])

  function login(newToken) {
    setStoredToken(newToken)
    setToken(newToken)
  }

  function logout() {
    setStoredToken(null)
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
