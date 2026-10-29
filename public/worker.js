// public/worker.js
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const response = await fetch(request)
  const newResponse = new Response(response.body, response)
  const headers = newResponse.headers

  // Enforce HTTPS
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  
  // Prevent the app from being embedded in iframes (Clickjacking defense)
  headers.set('X-Frame-Options', 'DENY')
  headers.set('X-Content-Type-Options', 'nosniff')
  
  // Strict CSP for an authenticated React app
  headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.axon-erp.com;"
  )

  return newResponse
}