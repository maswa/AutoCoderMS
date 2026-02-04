import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useHashRoute } from './hooks/useHashRoute'
import App from './App'
import { DocsPage } from './components/docs/DocsPage'
import './styles/globals.css'
// Note: Custom theme removed - using shadcn/ui theming instead

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5000,
      refetchOnWindowFocus: false,
    },
  },
})

function Router() {
  const { route } = useHashRoute()
  if (route === 'docs') return <DocsPage />
  return <App />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Router />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
