import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { ReactNode } from 'react';

interface ProtectedRouteProps{
    children:ReactNode;
    allowedRoles?:('admin'| 'user' | 'store_owner')[];
}

export const ProtectedRoute = ({children,allowedRoles}:ProtectedRouteProps)=>{
    const { isAuthenticated, user } = useAuth();

    if(!isAuthenticated){
        return <Navigate to="/login" replace />;
    }

    if(allowedRoles && user && !allowedRoles?.includes(user.role)){
        return <Navigate to="/unauthorized" replace/>;
    }

    return <>{children}</>
}