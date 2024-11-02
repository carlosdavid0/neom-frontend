import { BrowserRouter } from 'react-router-dom';
import AuthRoutes from './auth.routes';

function Routes() {
  return (
    <BrowserRouter>
      <AuthRoutes />
    </BrowserRouter>
  );
}

export default Routes;
