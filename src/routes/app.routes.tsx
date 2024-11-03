import Layout from '@/components/Layout';
import PrivateRoute from '@/components/private-route';
import Dashboard from '@/pages/app/dashboard';
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          index
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Route>
      <Route path='*' element={<Navigate to={'/'} />} />
    </Routes>
  );
};

export default AppRoutes;
