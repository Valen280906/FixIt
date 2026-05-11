import { useState } from 'react';
import { Package, Clock, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_ACTIVE_JOBS = [
  {
    id: 'REQ-001',
    techName: 'Carlos Rodríguez',
    service: 'Reparación de Nevera Samsung',
    status: 'in_progress', // 'pending', 'in_progress', 'completed'
    agreedPrice: 120,
    escrowStatus: 'held', // 'held', 'released'
    date: '10 May 2026',
  }
];

const ClientDashboard = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mi Panel</h1>
        <Link to="/search" className="bg-brand-blue text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-blueDark transition">
          Nueva Solicitud
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Activity & Requests */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="text-brand-blue" /> Trabajos Activos
            </h2>
            
            {MOCK_ACTIVE_JOBS.map(job => (
              <div key={job.id} className="border border-gray-200 rounded-xl p-5 mb-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded mb-2 inline-block">
                      {job.id}
                    </span>
                    <h3 className="font-bold text-lg text-gray-900">{job.service}</h3>
                    <p className="text-sm text-gray-600">Técnico: {job.techName}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-xl text-gray-900">${job.agreedPrice}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-brand-blue bg-blue-50">
                        En Progreso
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between w-full relative">
                    <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 -z-10 -translate-y-1/2"></div>
                    <div className="absolute left-0 top-1/2 w-1/2 h-1 bg-brand-blue -z-10 -translate-y-1/2"></div>
                    
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-brand-blue text-white flex items-center justify-center"><CheckCircle2 size={14}/></div>
                      <span className="text-[10px] mt-1 text-gray-600 font-medium">Asignado</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-brand-blue text-white flex items-center justify-center"><Clock size={14}/></div>
                      <span className="text-[10px] mt-1 text-brand-blue font-bold">En Camino</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center"><CheckCircle2 size={14}/></div>
                      <span className="text-[10px] mt-1 text-gray-400 font-medium">Finalizado</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Escrow Wallet */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center gap-2 mb-2 opacity-80">
              <ShieldCheck size={20} className="text-green-400" />
              <span className="text-sm font-medium">Fondo de Seguridad (Escrow)</span>
            </div>
            <p className="text-xs opacity-70 mb-4">
              Tu dinero está protegido. Solo se liberará al técnico cuando confirmes que el trabajo fue realizado.
            </p>
            
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10">
              <div className="text-sm opacity-80 mb-1">Saldo Retenido</div>
              <div className="text-4xl font-bold font-mono tracking-tight">$120.00</div>
            </div>

            <div className="mt-6 flex gap-2">
              <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm font-bold transition-colors shadow-lg shadow-green-500/20">
                Liberar Pago
              </button>
              <button className="px-4 bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 rounded-lg text-sm transition-colors" title="Reportar problema">
                <AlertCircle size={20} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ClientDashboard;
