import { useAuth } from '@/hook/useAuth';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './app.routes';
import AuthRoutes from './auth.routes';

function Routes() {
  const { isAuthenticated } = useAuth();
  console.log(isAuthenticated);
  
  return <BrowserRouter>{isAuthenticated ? <AppRoutes /> : <AuthRoutes />}</BrowserRouter>;
}

export default Routes;
