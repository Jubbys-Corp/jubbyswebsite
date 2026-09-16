import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'motion/react'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* one spring for the whole site, and every animation backs off when the
        OS asks for reduced motion */}
    <MotionConfig reducedMotion="user" transition={{ type: 'spring', stiffness: 130, damping: 18 }}>
      <App />
    </MotionConfig>
  </StrictMode>,
)
