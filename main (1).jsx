import React from 'react'
import ReactDOM from 'react-dom/client'
import PerigueuxAccess from './PerigueuxAccess.jsx'

const root = document.getElementById('root')

// Masquer l'écran de chargement HTML
const hideLoading = () => {
  const el = document.getElementById('loading-screen')
  if (el) { el.style.opacity = '0'; setTimeout(() => el.remove(), 300) }
}

// Démarrer React
ReactDOM.createRoot(root).render(
  React.createElement(PerigueuxAccess)
)
hideLoading()
