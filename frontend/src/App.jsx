import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import './App.css';
import HomePage from './pages/HomePage';
import ScrollToTop from './components/ScrollToTop';
import BlogsPage from './pages/BlogsPage';
import BlogDetailPage from './pages/BlogDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import BlogAdminPage from './pages/BlogAdminPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <main className='flex-grow'>
      <Router>
        <UnauthorizedMessage />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />

          {/* Protected Route for /add-blog */}
          <Route element={<ProtectedRoute />}>
            <Route path='/add-blog' element={<BlogAdminPage />} />
          </Route>

          <Route path="blog">
            <Route index element={<BlogsPage />} />
            <Route path=":slug" element={<BlogDetailPage />} />
            <Route path="not-found" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Router>
      <ScrollToTop />
    </main>
  );
}

// Component to display unauthorized message if redirected
const UnauthorizedMessage = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.unauthorized) {
      alert("You're not authorized to access this page.");
    }
  }, [location]);

  return null;
};

export default App;


// id: 6e3d3228-92b1-4703-b452-0f9219bead29

// tech tag:1b1fbdc2-7adb-4e0f-b774-67a02ef34216
// tech news: 4b0ad36b-a77c-464f-bb12-2cc32fc6d814