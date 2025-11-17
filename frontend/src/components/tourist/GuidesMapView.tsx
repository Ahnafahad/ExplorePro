/**
 * Guides Map View - Shows tourist spots, tours, and available guides on a map
 * Default location: Cambridge, UK
 */

import { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { MapPin, Star, Clock, Navigation, Landmark } from 'lucide-react';
import { Button } from '../common/Button';
import type { Guide } from '../../types';
import touristSpotsData from '../../data/demo/touristSpots.json';
import demoService from '../../services/demoService';

interface GuidesMapViewProps {
  guides: Guide[];
  onGuideClick?: (guide: Guide) => void;
}

// Cambridge city center coordinates
const CAMBRIDGE_CENTER = {
  lat: 52.2053,
  lng: 0.1218,
};

const MAP_CONTAINER_STYLE = {
  width: '100%',
  height: '600px',
  borderRadius: '12px',
};

const MAP_OPTIONS = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
  ],
};

export function GuidesMapView({ guides, onGuideClick }: GuidesMapViewProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [selectedSpot, setSelectedSpot] = useState<any>(null);
  const [selectedTour, setSelectedTour] = useState<any>(null);
  const [showSpots, setShowSpots] = useState(true);
  const [showGuides, setShowGuides] = useState(true);
  const [showTours, setShowTours] = useState(true);
  const [tours, setTours] = useState<any[]>([]);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  });

  // Load tours data
  useEffect(() => {
    const fetchTours = async () => {
      if (demoService.isDemoMode()) {
        const response = await demoService.tours.getAll();
        if (response.success && response.data) {
          // Get first 10 tours for map view
          setTours(response.data.slice(0, 10));
        }
      }
    };
    fetchTours();
  }, []);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Generate location for guides based on their availability
  // Scatter them around Cambridge tourist spots
  const getGuideLocation = (_guide: Guide, index: number) => {
    // Create a circle of guides around Cambridge center
    const radius = 0.008; // approximately 800 meters
    const angle = (index * 2 * Math.PI) / guides.length;

    return {
      lat: CAMBRIDGE_CENTER.lat + radius * Math.cos(angle),
      lng: CAMBRIDGE_CENTER.lng + radius * Math.sin(angle),
    };
  };

  // Generate location for tours - place them near tourist spots
  const getTourLocation = (_tour: any, index: number) => {
    // Create a slightly larger circle for tours
    const radius = 0.006; // approximately 600 meters
    const angle = (index * 2 * Math.PI) / tours.length;

    return {
      lat: CAMBRIDGE_CENTER.lat + radius * Math.cos(angle),
      lng: CAMBRIDGE_CENTER.lng + radius * Math.sin(angle),
    };
  };

  const recenterMap = () => {
    if (map) {
      map.panTo(CAMBRIDGE_CENTER);
      map.setZoom(14);
    }
  };

  // Handle API loading error (missing key or billing not enabled)
  if (loadError) {
    return (
      <div className="w-full rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 p-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex p-4 bg-yellow-100 rounded-full mb-4">
            <MapPin className="w-8 h-8 text-yellow-600" />
          </div>
          <h3 className="text-xl font-bold text-neutral-900 mb-2">
            Map Unavailable (API Key Required)
          </h3>
          <p className="text-neutral-600 mb-6">
            The interactive map requires a valid Google Maps API key with billing enabled.
            For demo purposes, you can still browse guides and tourist spots below.
          </p>

          {/* Fallback: List view of spots and guides */}
          <div className="grid md:grid-cols-2 gap-6 text-left">
            {/* Tourist Spots */}
            <div className="bg-white rounded-lg p-6 border border-neutral-200">
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Landmark className="w-5 h-5 text-red-600" />
                {touristSpotsData.length} Tourist Spots
              </h4>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {touristSpotsData.slice(0, 6).map((spot) => (
                  <div key={spot.id} className="border-b border-neutral-100 pb-2">
                    <p className="font-semibold text-sm">{spot.name}</p>
                    <p className="text-xs text-neutral-600">{spot.category}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs">{spot.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Available Guides */}
            <div className="bg-white rounded-lg p-6 border border-neutral-200">
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-600" />
                {guides.filter(g => g.isAvailable).length} Available Guides
              </h4>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {guides.filter(g => g.isAvailable).slice(0, 6).map((guide) => (
                  <div key={guide.id} className="border-b border-neutral-100 pb-2">
                    <p className="font-semibold text-sm">{guide.user?.name}</p>
                    <p className="text-xs text-neutral-600">£{guide.hourlyRate}/hr</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs">{guide.averageRating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>For Developers:</strong> Add <code className="bg-blue-100 px-2 py-1 rounded">VITE_GOOGLE_MAPS_API_KEY</code> to your <code className="bg-blue-100 px-2 py-1 rounded">.env</code> file and enable billing in Google Cloud Console.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-[600px] bg-neutral-100 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-neutral-400 mx-auto mb-3 animate-pulse" />
          <p className="text-neutral-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Map Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-xl border border-neutral-200 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary-100 rounded-lg">
            <MapPin className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900">Cambridge Explorer</h3>
            <p className="text-sm text-neutral-600">
              {[
                showGuides && `${guides.length} guides`,
                showTours && `${tours.length} tours`,
                showSpots && `${touristSpotsData.length} spots`,
              ].filter(Boolean).join(' • ') || 'No items visible'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={showGuides ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setShowGuides(!showGuides)}
            className="flex items-center gap-2"
          >
            <div className={`w-3 h-3 rounded-full ${showGuides ? 'bg-white' : 'bg-green-500'}`} />
            Guides
          </Button>
          <Button
            variant={showTours ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setShowTours(!showTours)}
            className="flex items-center gap-2"
          >
            <div className={`w-3 h-3 rounded-full ${showTours ? 'bg-white' : 'bg-blue-500'}`} />
            Tours
          </Button>
          <Button
            variant={showSpots ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setShowSpots(!showSpots)}
            className="flex items-center gap-2"
          >
            <div className={`w-3 h-3 rounded-full ${showSpots ? 'bg-white' : 'bg-red-500'}`} />
            Tourist Spots
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={recenterMap}
            className="flex items-center gap-2"
          >
            <Navigation className="w-4 h-4" />
            Recenter
          </Button>
        </div>
      </div>

      {/* Map */}
      <div className="relative rounded-xl overflow-hidden shadow-lg border border-neutral-200">
        <GoogleMap
          mapContainerStyle={MAP_CONTAINER_STYLE}
          center={CAMBRIDGE_CENTER}
          zoom={14}
          options={MAP_OPTIONS}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          {/* Tourist Spots Markers */}
          {showSpots &&
            touristSpotsData.map((spot) => (
              <Marker
                key={spot.id}
                position={{ lat: spot.location.lat, lng: spot.location.lng }}
                onClick={() => setSelectedSpot(spot)}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  fillColor: '#DC2626',
                  fillOpacity: 0.8,
                  strokeColor: '#FFFFFF',
                  strokeWeight: 2,
                  scale: 8,
                }}
              />
            ))}

          {/* Guide Markers */}
          {showGuides &&
            guides.map((guide, index) => (
              <Marker
                key={guide.id}
                position={getGuideLocation(guide, index)}
                onClick={() => setSelectedGuide(guide)}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  fillColor: guide.isAvailable ? '#10B981' : '#6B7280',
                  fillOpacity: 0.9,
                  strokeColor: '#FFFFFF',
                  strokeWeight: 3,
                  scale: 10,
                }}
              />
            ))}

          {/* Tour Markers */}
          {showTours &&
            tours.map((tour, index) => (
              <Marker
                key={tour.id}
                position={getTourLocation(tour, index)}
                onClick={() => setSelectedTour(tour)}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  fillColor: '#3B82F6',
                  fillOpacity: 0.85,
                  strokeColor: '#FFFFFF',
                  strokeWeight: 2,
                  scale: 9,
                }}
              />
            ))}

          {/* Tourist Spot Info Window */}
          {selectedSpot && (
            <InfoWindow
              position={{ lat: selectedSpot.location.lat, lng: selectedSpot.location.lng }}
              onCloseClick={() => setSelectedSpot(null)}
            >
              <div className="p-2 max-w-xs">
                <div className="flex items-start gap-2 mb-2">
                  <Landmark className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-neutral-900">{selectedSpot.name}</h4>
                    <p className="text-xs text-neutral-600">{selectedSpot.category}</p>
                  </div>
                </div>
                <p className="text-sm text-neutral-700 mb-2">{selectedSpot.description}</p>
                <div className="flex items-center gap-3 text-xs text-neutral-600">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span>{selectedSpot.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{selectedSpot.visitDuration}</span>
                  </div>
                </div>
              </div>
            </InfoWindow>
          )}

          {/* Guide Info Window */}
          {selectedGuide && (
            <InfoWindow
              position={getGuideLocation(
                selectedGuide,
                guides.findIndex((g) => g.id === selectedGuide.id)
              )}
              onCloseClick={() => setSelectedGuide(null)}
            >
              <div className="p-2 max-w-xs">
                <div className="flex items-start gap-3 mb-3">
                  <img
                    src={selectedGuide.user?.photo || ''}
                    alt={selectedGuide.user?.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-neutral-900">{selectedGuide.user?.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-semibold">{selectedGuide.averageRating}</span>
                      </div>
                      <span className="text-xs text-neutral-500">
                        ({selectedGuide.totalReviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      selectedGuide.isAvailable
                        ? 'bg-green-100 text-green-700'
                        : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        selectedGuide.isAvailable ? 'bg-green-500' : 'bg-neutral-400'
                      }`}
                    />
                    {selectedGuide.isAvailable ? 'Available Now' : 'Schedule Later'}
                  </span>
                </div>

                <p className="text-sm text-neutral-700 mb-3 line-clamp-2">{selectedGuide.bio}</p>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-200">
                  <span className="text-sm font-semibold text-primary-600">
                    £{selectedGuide.hourlyRate}/hr
                  </span>
                  <Button
                    size="sm"
                    onClick={() => {
                      if (onGuideClick) {
                        onGuideClick(selectedGuide);
                      }
                      setSelectedGuide(null);
                    }}
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            </InfoWindow>
          )}

          {/* Tour Info Window */}
          {selectedTour && (
            <InfoWindow
              position={getTourLocation(
                selectedTour,
                tours.findIndex((t) => t.id === selectedTour.id)
              )}
              onCloseClick={() => setSelectedTour(null)}
            >
              <div className="p-0 max-w-sm">
                {/* Tour Image Header */}
                <div className="relative h-32 bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 overflow-hidden">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiIG9wYWNpdHk9Ii4zIi8+PC9nPjwvc3ZnPg==')] opacity-20" />
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-neutral-900">
                      {selectedTour.category}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h4 className="font-bold text-white text-lg drop-shadow-lg">
                      {selectedTour.title}
                    </h4>
                  </div>
                </div>

                {/* Tour Details */}
                <div className="p-3">
                  <p className="text-sm text-neutral-700 mb-3 line-clamp-2">
                    {selectedTour.description}
                  </p>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-xs text-neutral-600">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      <span className="font-medium">{selectedTour.duration} minutes</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-600">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      <span className="line-clamp-1">{selectedTour.meetingPoint}</span>
                    </div>
                  </div>

                  {selectedTour.highlights && selectedTour.highlights.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-semibold text-neutral-700 mb-1.5">Highlights:</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedTour.highlights.slice(0, 2).map((highlight: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs"
                          >
                            {highlight}
                          </span>
                        ))}
                        {selectedTour.highlights.length > 2 && (
                          <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded text-xs">
                            +{selectedTour.highlights.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
                    <div>
                      <span className="text-xl font-bold text-blue-600">£{selectedTour.price}</span>
                      <span className="text-xs text-neutral-500 ml-1">per person</span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedTour(null);
                        // Tour booking could navigate to booking page
                      }}
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow" />
          <span className="text-sm text-neutral-700">Available Guides</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-neutral-400 border-2 border-white shadow" />
          <span className="text-sm text-neutral-700">Unavailable Guides</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow" />
          <span className="text-sm text-neutral-700">Tours</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-600 border-2 border-white shadow" />
          <span className="text-sm text-neutral-700">Tourist Attractions</span>
        </div>
      </div>
    </div>
  );
}
