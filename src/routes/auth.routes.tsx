import Login from '@/pages/auth/login';
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';


const AuthRoutes: React.FC = () => {
    return (
        
            <Routes>
                <Route path="/login" element={<Login />} />   
               <Route path='*' element={<Navigate to={'/login'} />} />
            </Routes>
   
    );
};

export default AuthRoutes;