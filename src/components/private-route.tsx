import { useAuth } from '@/hook/useAuth';
import { useMemo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
  redirectTo?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  requiredPermissions = [],
  redirectTo = '/',
}) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const getUserPermissions = (): string[] => {
    try {
      const userPermissions = JSON.parse(localStorage.getItem('userPermissions') || '[]');
      return userPermissions;
    } catch {
      return [];
    }
  };

  const hasRequiredPermissions = useMemo((): boolean => {
  
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const userPermissions = getUserPermissions();
    return requiredPermissions.every(permission => userPermissions.includes(permission));
  }, [requiredPermissions]); 

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (requiredPermissions?.length > 0 && !hasRequiredPermissions) {
    return <Navigate to="/acesso-negado" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;