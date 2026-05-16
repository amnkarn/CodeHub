import { BrowserRouter as Router } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRouter from "../App"
import { AuthProvider } from './context/authContext'

createRoot(document.getElementById('root')!).render(
  <Router>
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  </Router>
)
