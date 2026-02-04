import { useState, useEffect, useCallback } from 'react'

export type Route = 'app' | 'docs'

interface HashRouteState {
  route: Route
  section: string | null
  navigate: (hash: string) => void
}

function parseHash(hash: string): { route: Route; section: string | null } {
  const cleaned = hash.replace(/^#\/?/, '')
  if (cleaned === 'docs' || cleaned.startsWith('docs/')) {
    const section = cleaned.slice(5) || null // Remove 'docs/' prefix
    return { route: 'docs', section }
  }
  return { route: 'app', section: null }
}

export function useHashRoute(): HashRouteState {
  const [state, setState] = useState(() => parseHash(window.location.hash))

  useEffect(() => {
    const handleHashChange = () => {
      setState(parseHash(window.location.hash))
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const navigate = useCallback((hash: string) => {
    window.location.hash = hash
  }, [])

  return { ...state, navigate }
}
