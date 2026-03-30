import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem('vaigai_admin')
    return saved ? JSON.parse(saved) : null
  })

  const login = (data) => {
    setAdmin(data)
    localStorage.setItem('vaigai_admin', JSON.stringify(data))
  }

  const logout = () => {
    setAdmin(null)
    localStorage.removeItem('vaigai_admin')
  }

  return (
    <AuthContext.Provider value={{ admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
