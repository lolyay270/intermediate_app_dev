import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router";
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import './index.css'

import App from './App.tsx'

export const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="/ask" />
            <Route path="/best" />
            <Route path="/job" />
            <Route path="/new" />
            <Route path="/show" />
            <Route path="/top" />
            <Route path="/leaders" />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
