import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [forgotStep, setForgotStep] = useState(0); // 0: login, 1: email, 2: code, 3: new_pass
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState('');

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setForgotStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/verify-reset-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, code: resetCode })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setForgotStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, code: resetCode, newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess('Contraseña actualizada con éxito. Ya puedes iniciar sesión.');
      setForgotStep(0);
      setResetEmail('');
      setResetCode('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const user = await login(email, password);
      if (user.role === 'technician') {
        navigate('/dashboard/technician');
      } else {
        navigate('/dashboard/client');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] relative flex items-center justify-center py-10">
      {/* Background */}
      <div className="absolute inset-0">
        <img src="/home.png" alt="background" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-blue-950/72 backdrop-blur-sm"></div>
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Avatar Icon */}
          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg ring-4 ring-blue-100">
              <User size={32} className="text-white" />
            </div>
          </div>

          {forgotStep === 0 ? (
            <>
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-1">Bienvenido de nuevo</h2>
              <p className="text-gray-400 text-center text-sm mb-7">Inicia sesión para continuar</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      placeholder="correo@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      placeholder="Tu contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100">{error}</div>}
                {success && <div className="bg-green-50 text-green-600 text-sm px-4 py-3 rounded-xl border border-green-100">{success}</div>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-blue-500/30"
                >
                  {loading ? 'Ingresando...' : 'Acceso'}
                </button>
              </form>

              <div className="mt-6 space-y-3 text-center">
                <button onClick={() => setForgotStep(1)} className="text-sm text-blue-600 hover:underline">
                  ¿Se te olvidó tu contraseña?
                </button>
                <Link to="/register" className="block text-sm text-gray-500 font-medium">
                  ¿No tienes una cuenta? <span className="text-blue-600 underline">Regístrate</span>
                </Link>
              </div>
            </>
          ) : forgotStep === 1 ? (
            <>
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-1">Recuperar contraseña</h2>
              <p className="text-gray-400 text-center text-sm mb-7">Ingresa tu correo para recibir un código</p>
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tu correo registrado"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                  />
                </div>
                {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}
                <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl">
                  {loading ? 'Enviando...' : 'Enviar Código'}
                </button>
                <button onClick={() => setForgotStep(0)} className="w-full text-sm text-gray-500 py-2">Volver al inicio</button>
              </form>
            </>
          ) : forgotStep === 2 ? (
            <>
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-1">Verificar Código</h2>
              <p className="text-gray-400 text-center text-sm mb-7">Ingresa el código enviado a {resetEmail}</p>
              <form onSubmit={handleVerifyCode} className="space-y-4">
                <input
                  type="text"
                  required
                  maxLength="6"
                  className="w-full text-center text-2xl tracking-[1em] font-bold py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="000000"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                />
                {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}
                <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl">
                  {loading ? 'Verificando...' : 'Verificar'}
                </button>
                <button onClick={() => setForgotStep(1)} className="w-full text-sm text-gray-500 py-2">Reenviar código</button>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-1">Nueva Contraseña</h2>
              <p className="text-gray-400 text-center text-sm mb-7">Crea una contraseña segura para tu cuenta</p>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="password"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Mínimo 8 caracteres, Mayús y Núm"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="password"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Repite tu nueva contraseña"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100">{error}</div>}
                
                <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/20">
                  {loading ? 'Guardando...' : 'Actualizar Contraseña'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
