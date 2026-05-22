import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ isAuth }: { isAuth: boolean }) => {
  const location = useLocation();

  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;