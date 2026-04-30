import { BrowserRouter as Router } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRouter from './Routes.tsx'

createRoot(document.getElementById('root')!).render(
  <Router>
    <AppRouter />
  </Router>
)
