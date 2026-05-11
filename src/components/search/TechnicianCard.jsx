import { Star, MapPin, BadgeCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const TechnicianCard = ({ tech, onQuoteClick }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4 hover:shadow-md transition-shadow">
      <div className="flex-shrink-0">
        <Link to={`/technician/${tech.id}`} className="block w-16 h-16 rounded-full bg-gray-200 overflow-hidden relative group">
          <img src={tech.avatar} alt={tech.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
          {tech.verified && (
            <div className="absolute bottom-0 right-0 bg-white rounded-full">
              <BadgeCheck className="text-blue-500" size={20} fill="white" />
            </div>
          )}
        </Link>
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-start">
          <div>
            <Link to={`/technician/${tech.id}`} className="font-bold text-lg text-gray-900 flex items-center gap-1 hover:text-brand-blue transition-colors">
              {tech.name}
            </Link>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <Star className="text-yellow-400 mr-1" size={14} fill="currentColor" />
              <span className="font-medium text-gray-700">{tech.rating}</span>
              <span className="mx-1">•</span>
              <span>{tech.reviews} reseñas</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {tech.distance}
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
          {tech.description}
        </p>
        <div className="mt-4 flex gap-2">
          <button 
            onClick={() => onQuoteClick(tech)}
            className="flex-1 bg-brand-blue text-white py-2 rounded-lg font-medium text-sm hover:bg-brand-blueDark transition-colors"
          >
            Presupuesto Flash
          </button>
        </div>
      </div>
    </div>
  );
};

export default TechnicianCard;
