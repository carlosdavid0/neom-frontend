import { createRoot } from 'react-dom/client'
import Provider from './context/Provider'
import './index.css'
import Routes from './routes/routes'

createRoot(document.getElementById('root')!).render(
  <Provider>
    <Routes />
  </Provider>,
)
