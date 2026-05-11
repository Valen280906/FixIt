import { Link, useNavigate } from 'react-router-dom';
import { PenTool, LogOut, User } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-[9990]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-brand-blue text-white p-2 rounded-lg">
                <PenTool size={24} />
              </div>
              <span className="font-bold text-2xl text-brand-blue tracking-tight">FixIt</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link 
                  to={user.role === 'technician' ? "/dashboard/technician" : "/dashboard/client"} 
                  className="text-gray-600 hover:text-brand-blue font-medium flex items-center gap-1"
                >
                  <User size={18} /> {user.name}
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="text-red-500 font-semibold hover:text-red-700 flex items-center gap-1 ml-4"
                >
                  <LogOut size={18} /> Salir
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-gray-700 font-semibold px-4 py-2 rounded-lg border border-gray-200 hover:border-brand-blue hover:text-brand-blue transition-all text-sm"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="bg-brand-blue text-white font-semibold px-4 py-2 rounded-lg hover:bg-brand-blueDark transition-all shadow-md shadow-blue-500/20 hover:scale-105 active:scale-95 text-sm"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
