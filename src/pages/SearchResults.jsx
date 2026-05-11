import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { SlidersHorizontal, Navigation, MapPin } from 'lucide-react';
import TechnicianCard from '../components/search/TechnicianCard';
import FlashBudgetModal from '../components/search/FlashBudgetModal';

// ─── Haversine distance (km) ───────────────────────────────────────────────
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// ─── Custom map icons (DivIcon — avoids Vite bundling issues) ─────────────
const createTechIcon = (highlight = false) =>
  L.divIcon({
    className: '',
    html: `<div style="
      width:${highlight ? 40 : 32}px;
      height:${highlight ? 40 : 32}px;
      background:${highlight ? '#1d4ed8' : '#3b82f6'};
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      border:3px solid white;
      box-shadow:0 3px 10px rgba(0,0,0,0.35);
      transition:all .2s;
    "></div>`,
    iconSize: [highlight ? 40 : 32, highlight ? 40 : 32],
    iconAnchor: [highlight ? 20 : 16, highlight ? 40 : 32],
    popupAnchor: [0, -36],
  });

const userPinIcon = L.divIcon({
  className: '',
  html: `<div style="
    width:20px; height:20px;
    background:#22c55e;
    border-radius:50%;
    border:3px solid white;
    box-shadow:0 0 0 5px rgba(34,197,94,0.25);
  "></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// ─── Flies to new center smoothly ─────────────────────────────────────────
const MapFlyTo = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, zoom, { duration: 1.4 });
  }, [center, zoom, map]);
  return null;
};

// ─── Constants ────────────────────────────────────────────────────────────
const VENEZUELA_CENTER = [8.0, -66.0];
const VENEZUELA_ZOOM = 6;
const SEARCH_RADIUS_KM = 50;

// ─── Component ────────────────────────────────────────────────────────────
const SearchResults = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const serviceQuery = params.get('service') || 'Reparaciones';
  const locationQuery = params.get('location') || '';

  const [selectedTech, setSelectedTech] = useState(null);
  const [allTechnicians, setAllTechnicians] = useState([]);
  const [visibleTechs, setVisibleTechs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [geocoding, setGeocoding] = useState(false);
  const [geocodeError, setGeocodeError] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(VENEZUELA_CENTER);
  const [mapZoom, setMapZoom] = useState(VENEZUELA_ZOOM);

  // Fetch technicians once
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('http://localhost:5000/api/technicians');
        const data = await res.json();
        if (res.ok) {
          setAllTechnicians(data);
          setVisibleTechs(data.filter((t) => t.lat && t.lng));
        }
      } catch (err) {
        console.error('Error al obtener técnicos:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Geocode + filter when location query or technicians change
  useEffect(() => {
    if (!locationQuery || allTechnicians.length === 0) {
      setVisibleTechs(allTechnicians.filter((t) => t.lat && t.lng));
      setUserLocation(null);
      setMapCenter(VENEZUELA_CENTER);
      setMapZoom(VENEZUELA_ZOOM);
      setGeocodeError('');
      return;
    }

    (async () => {
      setGeocoding(true);
      setGeocodeError('');
      try {
        const query = encodeURIComponent(`${locationQuery}, Venezuela`);
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1&countrycodes=ve`,
          { headers: { 'Accept-Language': 'es' } }
        );
        const data = await res.json();

        if (data.length === 0) {
          setGeocodeError(`No se encontró "${locationQuery}" en Venezuela.`);
          setVisibleTechs(allTechnicians.filter((t) => t.lat && t.lng));
          return;
        }

        const uLat = parseFloat(data[0].lat);
        const uLng = parseFloat(data[0].lon);
        setUserLocation({ lat: uLat, lng: uLng });
        setMapCenter([uLat, uLng]);
        setMapZoom(12);

        const nearby = allTechnicians
          .filter((t) => t.lat && t.lng)
          .map((t) => ({
            ...t,
            distanceKm: haversineDistance(uLat, uLng, t.lat, t.lng),
          }))
          .filter((t) => t.distanceKm <= SEARCH_RADIUS_KM)
          .sort((a, b) => a.distanceKm - b.distanceKm)
          .map((t) => ({ ...t, distance: `A ${t.distanceKm.toFixed(1)} km` }));

        setVisibleTechs(nearby);
      } catch {
        setGeocodeError('Error al buscar la ubicación. Intenta de nuevo.');
      } finally {
        setGeocoding(false);
      }
    })();
  }, [locationQuery, allTechnicians]);

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)]">
      {/* ── Left list pane ── */}
      <div className="w-full md:w-2/5 flex flex-col bg-white border-r border-gray-200 shadow-sm overflow-hidden z-10">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">
            Resultados para &ldquo;{serviceQuery}&rdquo;
          </h1>

          {geocoding ? (
            <p className="text-sm text-blue-500 mt-1 animate-pulse">🔍 Buscando ubicación...</p>
          ) : geocodeError ? (
            <p className="text-sm text-red-500 mt-1">{geocodeError}</p>
          ) : userLocation ? (
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
              <Navigation size={12} className="text-green-500" />
              {visibleTechs.length} técnico(s) en un radio de {SEARCH_RADIUS_KM} km
            </p>
          ) : (
            <p className="text-sm text-gray-500 mt-1">
              {visibleTechs.length} técnico(s) disponibles en plataforma
            </p>
          )}

          <div className="mt-3">
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
              <SlidersHorizontal size={16} /> Filtros
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {loading ? (
            <div className="text-center py-10 text-gray-400 animate-pulse">
              Cargando técnicos...
            </div>
          ) : visibleTechs.length > 0 ? (
            visibleTechs.map((tech) => (
              <TechnicianCard
                key={tech.id}
                tech={tech}
                onQuoteClick={(t) => setSelectedTech(t)}
              />
            ))
          ) : (
            <div className="text-center py-10 bg-white border border-dashed border-gray-200 rounded-xl">
              <MapPin className="mx-auto text-gray-300 mb-2" size={36} />
              <h3 className="font-bold text-gray-800 mb-1">No hay técnicos en esta zona</h3>
              <p className="text-sm text-gray-400">
                Intenta con otra ubicación o sin ubicación para ver todos.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Right map pane ── */}
      <div className="hidden md:block w-full md:w-3/5">
        <MapContainer
          center={VENEZUELA_CENTER}
          zoom={VENEZUELA_ZOOM}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Fly to searched location */}
          <MapFlyTo center={mapCenter} zoom={mapZoom} />

          {/* User location pin */}
          {userLocation && (
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={userPinIcon}
            >
              <Popup>
                <div className="text-sm">
                  <span className="font-semibold">📍 Tu ubicación</span>
                  <br />
                  <span className="text-gray-500 text-xs">{locationQuery}</span>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Technician pins */}
          {visibleTechs.map((tech) =>
            tech.lat && tech.lng ? (
              <Marker
                key={tech.id}
                position={[tech.lat, tech.lng]}
                icon={createTechIcon(selectedTech?.id === tech.id)}
                eventHandlers={{ click: () => setSelectedTech(tech) }}
              >
                <Popup>
                  <div className="text-sm min-w-[150px]">
                    <div className="font-bold text-gray-900 mb-0.5">{tech.name}</div>
                    <div className="text-gray-500 text-xs">{tech.city || 'Técnico verificado'}</div>
                    {tech.distance && (
                      <div className="text-blue-600 font-semibold text-xs mt-1">
                        {tech.distance}
                      </div>
                    )}
                    <button
                      onClick={() => setSelectedTech(tech)}
                      className="mt-2 w-full bg-blue-600 text-white text-xs py-1.5 px-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      Presupuesto Flash ⚡
                    </button>
                  </div>
                </Popup>
              </Marker>
            ) : null
          )}
        </MapContainer>
      </div>

      {/* Flash budget modal */}
      {selectedTech && (
        <FlashBudgetModal tech={selectedTech} onClose={() => setSelectedTech(null)} />
      )}
    </div>
  );
};

export default SearchResults;
