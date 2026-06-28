import React, {
  Suspense, lazy, useState, useCallback,
} from 'react';
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

const App = () => {
  const [ready, setReady] = useState(false);
  const [loaderGone, setLoaderGone] = useState(false);
  const handleReady = useCallback(() => setReady(true), []);

  return (
    <HelmetProvider>
      <BrowserRouter basename={PUBLIC_URL}>
        <Analytics />
        <ThreeBackground onReady={handleReady} />
        {!loaderGone && (
          <div
            className={`site-loader${ready ? ' revealing' : ''}`}
            onAnimationEnd={() => setLoaderGone(true)}
          >
            <span className="site-loader-text">loading</span>
          </div>
        )}
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
};

export default App;
