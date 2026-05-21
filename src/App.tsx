import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import HomePage from '@/pages/HomePage/HomePage';
import CoursePage from '@/pages/CoursePage/CoursePage';
import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import WorkoutPage from './pages/WorkoutPage/WorkoutPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="courses/:id" element={<CoursePage />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="profile" element={<ProfilePage />} />
            <Route path="workout/:id" element={<WorkoutPage />} />
          </Route>

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
