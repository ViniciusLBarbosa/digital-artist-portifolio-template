import React from "react";
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'

interface PrivateRouteProps {
    element: React.ReactNode;
    path: string;
};

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, path }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Route path={path} element={element} /> : <Navigate to="/login" />;   
};
