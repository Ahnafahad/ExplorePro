/**
 * Guides Map View - Shows tourist spots and available guides on a map
 * Default location: Cambridge, UK
 */

import { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { MapPin, Star, Clock, Navigation, Landmark } from 'lucide-react';
import { Button } from '../common/Button';
import type { Guide } from '../../types';
import touristSpotsData from '../../data/demo/touristSpots.json';

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
  const [showSpots, setShowSpots] = useState(true);
  const [showGuides, setShowGuides] = useState(true);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  });

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

  const recenterMap = () => {
    if (map) {
      map.panTo(CAMBRIDGE_CENTER);
      map.setZoom(14);
    }
  };

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
              {showGuides && showSpots && `${guides.length} guides • ${touristSpotsData.length} spots`}
              {showGuides && !showSpots && `${guides.length} guides`}
              {!showGuides && showSpots && `${touristSpotsData.length} tourist spots`}
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
          <div className="w-4 h-4 rounded-full bg-red-600 border-2 border-white shadow" />
          <span className="text-sm text-neutral-700">Tourist Attractions</span>
        </div>
      </div>
    </div>
  );
}
