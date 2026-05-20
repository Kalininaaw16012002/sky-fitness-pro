import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import CoursePage from '@/pages/CoursePage';
import ProtectedRoute from '@/components/ProtectedRoute';
import ProfilePage from './pages/ProfilePage';
import WorkoutPage from './pages/WorkoutPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="courses/:id" element={<CoursePage />} />
          <Route path="workout/:id" element={<WorkoutPage />} />

          <Route element={<ProtectedRoute />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
