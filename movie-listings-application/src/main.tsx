import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router";
import './index.css'

import App from './App.tsx'
import NotFound from './Components/NotFound.tsx';
import Nav from './Components/Nav.tsx';
import { navItems } from './App.tsx';

export const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<NotFound />} /> {/*must be above other routes*/}

          <Route path="/" element={
            <>
              <Nav navItems={navItems}/> 
              <App />
            </>
          }>
            <Route path="/trending" />
            <Route path="/top_rated" />
            <Route path="/action" />
            <Route path="/animation" />
            <Route path="/comedy" />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
)
