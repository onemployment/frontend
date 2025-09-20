import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './store';
import { MuiProvider } from './theme';
import './index.css';
import { AppRoutes } from './routes';

export function RootApp() {
  return (
    <StrictMode>
      <Provider store={store}>
        <MuiProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </MuiProvider>
      </Provider>
    </StrictMode>
  );
}

const rootEl =
  typeof document !== 'undefined' ? document.getElementById('root') : null;

if (rootEl) {
  createRoot(rootEl).render(<RootApp />);
}
