self.addEventListener('install', e => self.skipWaiting())

self.addEventListener('activate', e => {
  e.waitUntil(
    Promise.all([
      clients.claim(),
      clearBadgeNow()
    ])
  )
})

self.addEventListener('message', e => {
  if (e.data?.type === 'CLEAR_BADGE' || e.data?.type === 'APP_FOCUSED') {
    e.waitUntil(clearBadgeNow())
  }
})

// Badge: usar navigator diretamente (sem self.)
// O contexto do Service Worker expoe navigator globalmente
async function setAppBadgeNow(count) {
  try {
    if ('setAppBadge' in navigator) {
      await navigator.setAppBadge(count)
    }
  } catch(e) {
    console.log('setAppBadge error:', e)
  }
}

async function clearBadgeNow() {
  try {
    if ('clearAppBadge' in navigator) {
      await navigator.clearAppBadge()
    } else if ('setAppBadge' in navigator) {
      await navigator.setAppBadge(0)
    }
  } catch(e) {}
}

self.addEventListener('push', e => {
  let data = {}
  try { data = e.data?.json() || {} } catch { /* Use the default notification for invalid payloads. */ }
  const title = data.title || "Tony's Painting"
  const body = data.body || 'New lead received.'
  const count = Number.isFinite(data.count) ? Math.max(0, data.count) : 1

  e.waitUntil(
    Promise.all([
      // Mostrar notificacao
      self.registration.showNotification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        vibrate: [200, 100, 200],
        tag: data.type === 'reminder' ? 'appointment-reminder' : 'new-lead',
        renotify: true,
        data: { url: '/dashboard', count }
      }),
      // Atualizar badge no icone do app
      setAppBadgeNow(count)
    ])
  )
})

self.addEventListener('notificationclick', e => {
  e.notification.close()
  e.waitUntil(
    Promise.all([
      clearBadgeNow(),
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
        for (const client of list) {
          if (client.url.includes('/dashboard') && 'focus' in client) {
            return client.focus()
          }
        }
        return clients.openWindow('/dashboard')
      })
    ])
  )
})

// Limpar badge quando a janela ganha foco
self.addEventListener('focus', () => clearBadgeNow())
