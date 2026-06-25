import React, { Suspense, lazy } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import Analytics from './components/Template/Analytics';
import ThreeBackground from './components/Template/ThreeBackground';
import './static/css/main.scss';

const { PUBLIC_URL } = process.env;

const Journey = lazy(() => import('./pages/Journey'));
const Observe = lazy(() => import('./pages/Observe'));

const App = () => (
  <HelmetProvider>
    <BrowserRouter basename={PUBLIC_URL}>
      <Analytics />
      <ThreeBackground />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Journey />} />
          <Route path="/observe" element={<Observe />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </HelmetProvider>
);

export default App;
