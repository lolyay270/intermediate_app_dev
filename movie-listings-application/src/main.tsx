import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Trending from './Components/Trending.tsx';
import NotFound from './Components/NotFound.tsx';

export const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<NotFound />} /> {/*must be above other routes*/}

          <Route path="/" element={<App />}>
          <Route index element={<Navigate to="trending" />} />
            <Route path="trending" element={<Trending />} />
            <Route path="top_rated" />
            <Route path="action"/>
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
)
