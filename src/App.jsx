import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LandingPage from './pages/LandingPage';
import SearchResults from './pages/SearchResults';
import TechnicianProfile from './pages/TechnicianProfile';
import ClientDashboard from './pages/ClientDashboard';
import TechnicianDashboard from './pages/TechnicianDashboard';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/technician/:id" element={<TechnicianProfile />} />
            <Route path="/dashboard/client" element={<ClientDashboard />} />
            <Route path="/dashboard/technician" element={<TechnicianDashboard />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
