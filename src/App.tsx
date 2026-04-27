import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/AppShell';
import { TodayPage } from '@/pages/Today';
import { PipelinePage } from '@/pages/Pipeline';
import { PropertyDetailPage } from '@/pages/PropertyDetail';
import { LoginPage } from '@/pages/Login';

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<AppShell />}>
        <Route index element={<TodayPage />} />
        <Route path="pipeline" element={<PipelinePage />} />
        <Route path="property/:id" element={<PropertyDetailPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
