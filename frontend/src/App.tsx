import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import EditPresentationPage from './pages/EditPresentationPage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/Register" element={<RegisterPage />} />
        <Route path='/dashboard' element={<DashboardPage />} />
        <Route path="/presentation/:id" element={<EditPresentationPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

