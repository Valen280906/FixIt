const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <span className="font-bold text-xl tracking-tight">FixIt</span>
          <p className="text-gray-400 text-sm mt-1">Servicios técnicos de confianza para tu hogar.</p>
        </div>
        <div className="flex gap-6 text-sm text-gray-400">
          <a href="#" className="hover:text-white">Términos</a>
          <a href="#" className="hover:text-white">Privacidad</a>
          <a href="#" className="hover:text-white">Ayuda</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
