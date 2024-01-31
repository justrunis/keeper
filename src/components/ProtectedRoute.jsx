import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({
    redirectPath = '/',
    children,
    token,
  }) => {
    if (!token) {
      return <Navigate to={redirectPath} replace />;
    }
  
    return children ? children : <Outlet />;
  };

export default ProtectedRoute;