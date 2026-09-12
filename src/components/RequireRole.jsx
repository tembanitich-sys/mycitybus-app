import { Navigate } from 'react-router-dom'
import { useAppState } from '../context/AppStateContext'

export default function RequireRole({ role, children }) {
  const { auth } = useAppState()
  if (auth.role !== role) {
    return <Navigate to="/role" replace />
  }
  return children
}
