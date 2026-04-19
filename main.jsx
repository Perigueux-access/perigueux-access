import React from 'react'
import ReactDOM from 'react-dom/client'

// Masquer l'écran de chargement
const hideLoading = () => {
  const ls = document.getElementById('loading-screen')
  if (ls) { ls.style.opacity = '0'; ls.style.transition = 'opacity 0.3s'; setTimeout(() => ls.remove(), 300) }
}

// Afficher une erreur visible
const showError = (msg) => {
  hideLoading()
  document.getElementById('root').innerHTML = `
    <div style="padding:40px;text-align:center;font-family:Georgia,serif;background:#F5EFE0;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;">
      <div style="font-size:48px">♿</div>
      <div style="font-size:18px;font-weight:700;color:#2E2618">PérigueuxAccess</div>
      <div style="font-size:13px;color:#C65D3F;font-weight:600">Erreur de démarrage</div>
      <pre style="font-size:10px;color:#666;text-align:left;max-width:320px;overflow:auto;background:#fff;padding:12px;border-radius:8px;">${msg}</pre>
      <button onclick="location.reload()" style="padding:12px 24px;background:#C65D3F;color:white;border:none;border-radius:20px;font-size:14px;cursor:pointer">Réessayer</button>
    </div>
  `
}

try {
  const { default: PerigueuxAccess } = await import('./PerigueuxAccess.jsx')
  const root = document.getElementById('root')
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <PerigueuxAccess />
    </React.StrictMode>
  )
  hideLoading()
} catch(e) {
  showError(e.message + '\n\n' + (e.stack || '').substring(0, 400))
}
