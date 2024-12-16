import 'bootstrap/dist/css/bootstrap.min.css';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { store } from './redux/store.ts'
import { Provider } from 'react-redux'

import './index.css'
import './font/font.scss'
import App from './App'
import GlobalStyles from './components/global_style/index'
import { ThemeProvider } from './ustils/theme/themeContex.tsx'


createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <StrictMode>
      <ThemeProvider>
        <GlobalStyles>
          <App />
        </GlobalStyles>
      </ThemeProvider>
    </StrictMode>
  </Provider>,
)
