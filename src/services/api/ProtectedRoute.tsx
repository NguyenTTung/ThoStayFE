import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  role: string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string;
  // thêm các trường khác nếu cần
}

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode<TokenPayload>(token);
    const role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    return allowedRoles.includes(role) ? (
      <Outlet />
    ) : (
      <Navigate to="/unauthorized" replace />
    );
  } catch {
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;