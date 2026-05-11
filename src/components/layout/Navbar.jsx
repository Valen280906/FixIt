import { Link } from 'react-router-dom';
import { PenTool, LogOut, User } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
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
                  onClick={logout} 
                  className="text-red-500 font-semibold hover:text-red-700 flex items-center gap-1 ml-4"
                >
                  <LogOut size={18} /> Salir
                </button>
              </>
            ) : (
              <Link to="/login" className="text-brand-blue font-semibold hover:text-brand-blueDark">
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
