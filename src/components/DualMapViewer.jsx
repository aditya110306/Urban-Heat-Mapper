import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { METRIC_CONFIGS, getColorForValue } from '../utils/colorScales';
import {
  Layers,
  SplitSquareVertical,
  MapPin,
  Compass,
  X,
  AlertTriangle,
  Activity,
  KeyRound,
  Check,
  CheckCircle2,
  Globe
} from 'lucide-react';

const NASHIK_CENTER = [20.08, 74.05];
const DEFAULT_ZOOM = 9;

export default function DualMapViewer({
  geoData,
  districtBoundary,
  activeMetric,
  h3Resolution,
  selectedCell,
  onSelectCell,
  talukasData
}) {
  const refMapContainer = useRef(null);
  const heatMapContainer = useRef(null);
  const refMapInstance = useRef(null);
  const heatMapInstance = useRef(null);
  const isSyncing = useRef(false);

  const [mapMode, setMapMode] = useState('split'); // 'split', 'heat_only', 'ref_only'
  // Default to the actual Google Maps Roadmap!
  const [basemapStyle, setBasemapStyle] = useState('google_roadmap');
  const [showTalukaLabels, setShowTalukaLabels] = useState(true);

  // Google Maps API Key handling
  const [googleApiKey, setGoogleApiKey] = useState(() => {
    return localStorage.getItem('urban_heat_mapper_gmaps_key') ||
           import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  });
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(googleApiKey);

  const heatGeoJsonLayer = useRef(null);
  const boundaryLayerHeat = useRef(null);
  const boundaryLayerRef = useRef(null);
  const talukaMarkersHeat = useRef(null);
  const talukaMarkersRef = useRef(null);

  // Initialize Reference Map
  useEffect(() => {
    if (!refMapContainer.current || refMapInstance.current) return;

    const map = L.map(refMapContainer.current, {
      center: NASHIK_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: true,
      preferCanvas: true
    });

    refMapInstance.current = map;

    return () => {
      map.remove();
      refMapInstance.current = null;
    };
  }, []);

  // Initialize Heat Map
  useEffect(() => {
    if (!heatMapContainer.current || heatMapInstance.current) return;

    const map = L.map(heatMapContainer.current, {
      center: NASHIK_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
      preferCanvas: true
    });

    heatMapInstance.current = map;

    return () => {
      map.remove();
      heatMapInstance.current = null;
    };
  }, []);

  // Update Basemaps on both maps (supports actual Google Maps Roadmap, Satellite, Hybrid, Terrain, OSM, Dark)
  useEffect(() => {
    const maps = [refMapInstance.current, heatMapInstance.current].filter(Boolean);
    if (!maps.length) return;

    maps.forEach((m, idx) => {
      // Clear existing tile layers
      m.eachLayer((layer) => {
        if (layer instanceof L.TileLayer) {
          m.removeLayer(layer);
        }
      });

      let tileUrl = '';
      let attribution = '';
      let subdomains = 'abcd';
      const keyParam = googleApiKey ? `&key=${googleApiKey}` : '';

      if (basemapStyle === 'google_roadmap') {
        // Actual Google Maps Roadmap (roads, highways, English/local place names, POIs)
        tileUrl = `https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}${keyParam}`;
        attribution = '&copy; <a href="https://maps.google.com" target="_blank" rel="noreferrer">Google Maps</a>';
        subdomains = ['0', '1', '2', '3'];
      } else if (basemapStyle === 'google_hybrid') {
        // Google Satellite with road network & place labels
        tileUrl = `https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}${keyParam}`;
        attribution = '&copy; <a href="https://maps.google.com" target="_blank" rel="noreferrer">Google Maps Satellite</a>';
        subdomains = ['0', '1', '2', '3'];
      } else if (basemapStyle === 'google_terrain') {
        // Google Terrain with shaded relief & roads
        tileUrl = `https://mt{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}${keyParam}`;
        attribution = '&copy; <a href="https://maps.google.com" target="_blank" rel="noreferrer">Google Maps Terrain</a>';
        subdomains = ['0', '1', '2', '3'];
      } else if (basemapStyle === 'dark') {
        tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
        attribution = '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap contributors';
        subdomains = 'abcd';
      } else if (basemapStyle === 'osm') {
        tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
        subdomains = 'abc';
      }

      L.tileLayer(tileUrl, {
        attribution,
        maxZoom: 20,
        subdomains: subdomains
      }).addTo(m);
    });
  }, [basemapStyle, googleApiKey]);

  // Synchronize Pan and Zoom between both maps
  useEffect(() => {
    const m1 = refMapInstance.current;
    const m2 = heatMapInstance.current;
    if (!m1 || !m2) return;

    const handleSync = (source, target) => {
      if (isSyncing.current) return;
      isSyncing.current = true;
      const center = source.getCenter();
      const zoom = source.getZoom();
      target.setView(center, zoom, { animate: false });
      isSyncing.current = false;
    };

    const onM1Move = () => handleSync(m1, m2);
    const onM2Move = () => handleSync(m2, m1);

    m1.on('move', onM1Move);
    m2.on('move', onM2Move);

    return () => {
      m1.off('move', onM1Move);
      m2.off('move', onM2Move);
    };
  }, [mapMode]);

  // Render District Boundary on both maps
  useEffect(() => {
    if (!districtBoundary) return;

    const addBoundary = (map, refLayer, color = '#f97316') => {
      if (!map) return;
      if (refLayer.current) map.removeLayer(refLayer.current);

      refLayer.current = L.geoJSON(districtBoundary, {
        style: {
          color: color,
          weight: 2.8,
          dashArray: '6, 6',
          fillColor: 'transparent',
          fillOpacity: 0
        }
      }).addTo(map);
    };

    addBoundary(heatMapInstance.current, boundaryLayerHeat, '#f97316');
    addBoundary(refMapInstance.current, boundaryLayerRef, '#2563eb');
  }, [districtBoundary]);

  // Render Taluka centroid markers/labels
  useEffect(() => {
    if (!talukasData) return;

    const addTalukaLabels = (map, refLayer) => {
      if (!map) return;
      if (refLayer.current) map.removeLayer(refLayer.current);

      if (!showTalukaLabels) return;

      const group = L.layerGroup();
      talukasData.features.forEach((feat) => {
        const [lon, lat] = feat.geometry.coordinates;
        const name = feat.properties.taluka;
        const marker = L.circleMarker([lat, lon], {
          radius: 5,
          fillColor: '#ffffff',
          color: '#1e293b',
          weight: 2,
          fillOpacity: 0.95
        });
        marker.bindTooltip(`<b>${name}</b>`, {
          permanent: false,
          direction: 'top',
          className: 'taluka-tooltip'
        });
        group.addLayer(marker);
      });

      refLayer.current = group.addTo(map);
    };

    addTalukaLabels(refMapInstance.current, talukaMarkersRef);
    addTalukaLabels(heatMapInstance.current, talukaMarkersHeat);
  }, [talukasData, showTalukaLabels]);

  // Render H3 Hexagons on Heat Map
  useEffect(() => {
    const map = heatMapInstance.current;
    if (!map || !geoData) return;

    if (heatGeoJsonLayer.current) {
      map.removeLayer(heatGeoJsonLayer.current);
    }

    const layer = L.geoJSON(geoData, {
      renderer: L.canvas(),
      style: (feature) => {
        const props = feature.properties;
        const val = props[activeMetric];
        const fillColor = getColorForValue(activeMetric, val);
        const isSelected = selectedCell && selectedCell.h3_index === props.h3_index;

        return {
          fillColor: fillColor,
          weight: isSelected ? 2.5 : 0.4,
          opacity: isSelected ? 1 : 0.5,
          color: isSelected ? '#ffffff' : '#000000',
          fillOpacity: isSelected ? 0.95 : 0.72
        };
      },
      onEachFeature: (feature, fLayer) => {
        fLayer.on({
          click: (e) => {
            L.DomEvent.stopPropagation(e);
            onSelectCell(feature.properties);
          },
          mouseover: (e) => {
            const p = feature.properties;
            const config = METRIC_CONFIGS[activeMetric];
            const val = p[activeMetric];
            const valFormatted = val !== undefined ? `${val} ${config.units}` : 'N/A';

            fLayer.bindTooltip(
              `<div style="font-family: sans-serif; font-size: 11px;">
                <b>${p.taluka} Taluka</b> (H3: ${p.h3_index})<br/>
                ${config.shortLabel}: <b style="color: #ea580c;">${valFormatted}</b><br/>
                <span style="color: #64748b;">Click cell to inspect details</span>
              </div>`,
              { sticky: true }
            ).openTooltip();
          }
        });
      }
    }).addTo(map);

    heatGeoJsonLayer.current = layer;
  }, [geoData, activeMetric, selectedCell]);

  // Adjust Leaflet sizes on mode change
  useEffect(() => {
    setTimeout(() => {
      if (refMapInstance.current) refMapInstance.current.invalidateSize();
      if (heatMapInstance.current) heatMapInstance.current.invalidateSize();
    }, 200);
  }, [mapMode]);

  const handleSaveApiKey = () => {
    setGoogleApiKey(tempApiKey.trim());
    localStorage.setItem('urban_heat_mapper_gmaps_key', tempApiKey.trim());
    setIsKeyModalOpen(false);
  };

  const handleClearApiKey = () => {
    setTempApiKey('');
    setGoogleApiKey('');
    localStorage.removeItem('urban_heat_mapper_gmaps_key');
    setIsKeyModalOpen(false);
  };

  const activeConfig = METRIC_CONFIGS[activeMetric] || METRIC_CONFIGS.lst_summer_mean;

  return (
    <div className="map-viewport-wrapper" id="nashik-dual-map-viewport">

      <div className="dual-map-container">
        {/* Left Pane: Actual Google Map Reference View */}
        {(mapMode === 'split' || mapMode === 'ref_only') && (
          <div className="map-pane map-pane-left">
            <div className="map-badge-overlay">
              <span className="map-badge-title" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ color: '#4285F4' }}>G</span>
                <span style={{ color: '#EA4335' }}>o</span>
                <span style={{ color: '#FBBC05' }}>o</span>
                <span style={{ color: '#4285F4' }}>g</span>
                <span style={{ color: '#34A853' }}>l</span>
                <span style={{ color: '#EA4335' }}>e</span>
                <span>Maps Reference</span>
              </span>
              <span className="map-badge-tag">
                {basemapStyle === 'google_roadmap' ? 'Roadmap' : (basemapStyle === 'google_hybrid' ? 'Satellite View' : 'Terrain View')}
              </span>
            </div>

            {/* Clean View Toggles: Map, Satellite, Terrain */}
            <div className="google-view-selector" id="google-map-view-selector">
              <button
                type="button"
                className={`view-pill-btn ${basemapStyle === 'google_roadmap' ? 'active' : ''}`}
                onClick={() => setBasemapStyle('google_roadmap')}
                title="Google Maps Official Roadmap"
                id="btn-gmap-roadmap"
              >
                🗺️ Map
              </button>
              <button
                type="button"
                className={`view-pill-btn ${basemapStyle === 'google_hybrid' ? 'active' : ''}`}
                onClick={() => setBasemapStyle('google_hybrid')}
                title="Google Maps Satellite Imagery with Roads & Place Labels"
                id="btn-gmap-satellite"
              >
                🛰️ Satellite
              </button>
              <button
                type="button"
                className={`view-pill-btn ${basemapStyle === 'google_terrain' ? 'active' : ''}`}
                onClick={() => setBasemapStyle('google_terrain')}
                title="Google Maps Topographic Terrain Relief"
                id="btn-gmap-terrain"
              >
                ⛰️ Terrain
              </button>
            </div>

            <div ref={refMapContainer} style={{ width: '100%', height: '100%' }}></div>
          </div>
        )}

        {/* Right Pane: Thermal Heat Map */}
        {(mapMode === 'split' || mapMode === 'heat_only') && (
          <div className="map-pane map-pane-right">
            <div className="map-badge-overlay">
              <span className="map-badge-title">Heat Map (H3 Hexagons)</span>
              <span className="map-badge-tag">{activeConfig.label}</span>
            </div>
            <div ref={heatMapContainer} style={{ width: '100%', height: '100%' }}></div>

            {/* Dynamic Legend */}
            <div className="legend-card" id="thermal-legend-card">
              <div className="legend-header">
                <span className="legend-title">{activeConfig.shortLabel}</span>
                <span className="legend-units">{activeConfig.units}</span>
              </div>
              <div
                className="legend-bar"
                style={{ background: activeConfig.gradient }}
              ></div>
              <div className="legend-scale-labels">
                <span>{activeConfig.min} {activeConfig.units}</span>
                <span>{Math.round((activeConfig.min + activeConfig.max) / 2)} {activeConfig.units}</span>
                <span>{activeConfig.max} {activeConfig.units}</span>
              </div>
              <div className="legend-explanation">
                {activeConfig.description}
              </div>
            </div>

            {/* Hexagon Click Inspector */}
            {selectedCell && (
              <div className="inspector-panel" id="hex-inspector-panel">
                <div className="inspector-header">
                  <div>
                    <div className="inspector-title">
                      <Activity size={16} color="#f97316" />
                      {selectedCell.taluka} Taluka
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'monospace' }}>
                      H3 Cell: {selectedCell.h3_index} (Res {selectedCell.resolution || h3Resolution})
                    </div>
                  </div>
                  <button
                    className="inspector-close-btn"
                    onClick={() => onSelectCell(null)}
                    title="Close Inspector"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="inspector-grid">
                  <div className="stat-box">
                    <div className="stat-box-label">Landsat LST (Mean)</div>
                    <div className="stat-box-value hot">
                      {selectedCell.lst_summer_mean ?? 'N/A'} °C
                    </div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-box-label">IMD Air Temp (Shaded)</div>
                    <div className="stat-box-value air">
                      {selectedCell.air_temp_summer_c ?? 'N/A'} °C
                    </div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-box-label">Skin vs Air Gap (ΔT)</div>
                    <div className="stat-box-value">
                      +{(selectedCell.lst_summer_mean - selectedCell.air_temp_summer_c).toFixed(1)} °C
                    </div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-box-label">5-Yr Trend (2019-24)</div>
                    <div className="stat-box-value hot">
                      +{selectedCell.lst_change_5yr ?? 'N/A'} °C
                    </div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-box-label">Impervious Built-Up</div>
                    <div className="stat-box-value">
                      {selectedCell.built_up_pct ?? 'N/A'}%
                    </div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-box-label">Vegetation (NDVI)</div>
                    <div className="stat-box-value cool">
                      {selectedCell.ndvi ?? 'N/A'}
                    </div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-box-label">Elevation (Copernicus)</div>
                    <div className="stat-box-value">
                      {selectedCell.elevation_m ?? 'N/A'} m
                    </div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-box-label">Valid Satellite Passes</div>
                    <div className="stat-box-value">
                      {selectedCell.obs_count_summer ?? 'N/A'} passes
                    </div>
                  </div>
                </div>

                <div className="inspector-notice">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                    <AlertTriangle size={13} /> Data Resolution & Measurement Caveat:
                  </div>
                  LST measures radiometric surface skin temperature (30m thermal). Shaded ambient air temperature is from IMD’s 0.25° grid (~27 km). Surface skin temp routinely exceeds ambient air by 5°C to 11°C under midday direct solar radiation.
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Google Maps API Key Modal */}
      {isKeyModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsKeyModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <div className="modal-title">
                <KeyRound size={20} color="#f97316" />
                Connect Google Maps API Key
              </div>
              <button className="inspector-close-btn" onClick={() => setIsKeyModalOpen(false)} title="Close">
                <X size={18} />
              </button>
            </div>

            <div className="modal-body" style={{ gap: '0.85rem' }}>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: '1.5' }}>
                The left pane is currently rendering the <b>actual Google Map</b> (Roadmap with streets, highways, English/Marathi labels, and landmarks).
                <br /><br />
                If you have a Google Maps Platform API Key (or billing project key), enter it below to authorize requests directly with your Google Cloud account.
              </p>

              <div>
                <label style={{ fontSize: '0.76rem', color: '#fed7aa', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                  Google Maps API Key (AIzaSy...):
                </label>
                <input
                  type="text"
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  placeholder="Paste your Google Maps API Key here"
                  style={{
                    width: '100%',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.6rem 0.85rem',
                    color: '#ffffff',
                    fontFamily: 'monospace',
                    fontSize: '0.82rem',
                    outline: 'none'
                  }}
                  id="input-gmaps-api-key"
                />
              </div>

              <div style={{ background: 'rgba(56, 189, 248, 0.08)', borderLeft: '3px solid #38bdf8', padding: '0.6rem', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0', fontSize: '0.74rem', color: '#bae6fd' }}>
                <b>Note:</b> You can also configure this permanently in <code>.env</code> as <code>VITE_GOOGLE_MAPS_API_KEY=your_key_here</code>.
              </div>
            </div>

            <div className="modal-footer" style={{ gap: '0.5rem' }}>
              {googleApiKey && (
                <button
                  type="button"
                  className="btn-nav"
                  onClick={handleClearApiKey}
                  style={{ marginRight: 'auto', color: '#f87171' }}
                >
                  Clear Key
                </button>
              )}
              <button
                type="button"
                className="btn-nav"
                onClick={() => setIsKeyModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleSaveApiKey}
                id="btn-save-gmaps-key"
              >
                <Check size={14} /> Save & Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
