import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/Auth/ProtectedRoute';
import { Dashboard, CourriersEntrants, CourriersSortants, CourrierDetailPage } from '../pages';
import NouveauCourrier from '../pages/NouveauCourrier';
import UserProfile from '../components/Auth/UserProfile';
import LoginForm from '../components/Auth/LoginForm';
import Layout from '../components/Layout/Layout';
import { fetchCourriers } from '../store/slices/courrier/thunks';
import { useAppDispatch } from '../store/hooks';

const AppRoutes: React.FC = () => {
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    dispatch(fetchCourriers());
  }, []);
  
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="courriers/entrants">
            <Route path="" element={<CourriersEntrants />} />
            <Route path=":id" element={<CourrierDetailPage />} />
          </Route>

          <Route path="courriers/sortants">
            <Route path="" element={<CourriersSortants />} />
            <Route path=":id" element={<CourrierDetailPage />} />
          </Route>
          
          <Route path="courriers/nouveau" element={<NouveauCourrier />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="archives" element={<div>Archives (à implémenter)</div>} />
          <Route path="suivi" element={<div>Suivi (à implémenter)</div>} />
          <Route path="admin/*" element={<div>Administration (à implémenter)</div>} />
        </Route>
      </Route>      
      <Route path="/login" element={<LoginForm />} />
    </Routes>
  );
};

export default AppRoutes;
