import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { METRIC_CONFIGS, getColorForValue } from '../utils/colorScales';
import { Layers, Maximize2, SplitSquareVertical, MapPin, Eye, Compass, Info, X, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';

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
  const [basemapStyle, setBasemapStyle] = useState('dark'); // 'dark', 'osm', 'satellite'
  const [showTalukaLabels, setShowTalukaLabels] = useState(true);

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
      zoomControl: true,
      preferCanvas: true
    });

    heatMapInstance.current = map;

    return () => {
      map.remove();
      heatMapInstance.current = null;
    };
  }, []);

  // Update Basemaps on both maps
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

      if (basemapStyle === 'dark') {
        tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
        attribution = '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap contributors';
      } else if (basemapStyle === 'osm') {
        tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        attribution = '&copy; OpenStreetMap contributors';
      } else if (basemapStyle === 'satellite') {
        tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
        attribution = '&copy; Esri, Maxar, Earthstar Geographics';
      }

      L.tileLayer(tileUrl, {
        attribution,
        maxZoom: 18,
        subdomains: 'abcd'
      }).addTo(m);
    });
  }, [basemapStyle]);

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
          weight: 2.5,
          dashArray: '5, 5',
          fillColor: 'transparent',
          fillOpacity: 0
        }
      }).addTo(map);
    };

    addBoundary(heatMapInstance.current, boundaryLayerHeat, '#f97316');
    addBoundary(refMapInstance.current, boundaryLayerRef, '#38bdf8');
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
          radius: 4,
          fillColor: '#ffffff',
          color: '#0f172a',
          weight: 1.5,
          fillOpacity: 0.9
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
      renderer: L.canvas(), // High performance canvas rendering for thousands of hexagons
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

  const activeConfig = METRIC_CONFIGS[activeMetric] || METRIC_CONFIGS.lst_summer_mean;

  return (
    <div className="map-viewport-wrapper" id="nashik-dual-map-viewport">
      {/* Mode and Basemap Docks */}
      <div className="map-mode-dock">
        <button
          className={`dock-btn ${mapMode === 'split' ? 'active' : ''}`}
          onClick={() => setMapMode('split')}
          title="Side-by-side synchronized view"
        >
          <SplitSquareVertical size={13} /> Side-by-Side
        </button>
        <button
          className={`dock-btn ${mapMode === 'heat_only' ? 'active' : ''}`}
          onClick={() => setMapMode('heat_only')}
          title="Heat Map Only"
        >
          <Compass size={13} /> Heat Map
        </button>
        <button
          className={`dock-btn ${mapMode === 'ref_only' ? 'active' : ''}`}
          onClick={() => setMapMode('ref_only')}
          title="Reference Map Only"
        >
          <MapPin size={13} /> Street Map
        </button>

        <span style={{ height: '14px', width: '1px', background: 'rgba(255,255,255,0.2)', margin: '0 2px' }}></span>

        <button
          className={`dock-btn ${basemapStyle === 'dark' ? 'active' : ''}`}
          onClick={() => setBasemapStyle('dark')}
          title="Dark Carto Basemap"
        >
          Dark
        </button>
        <button
          className={`dock-btn ${basemapStyle === 'osm' ? 'active' : ''}`}
          onClick={() => setBasemapStyle('osm')}
          title="OpenStreetMap"
        >
          OSM
        </button>
        <button
          className={`dock-btn ${basemapStyle === 'satellite' ? 'active' : ''}`}
          onClick={() => setBasemapStyle('satellite')}
          title="Satellite Imagery"
        >
          Satellite
        </button>
      </div>

      <div className="dual-map-container">
        {/* Left Pane: Reference Map */}
        {(mapMode === 'split' || mapMode === 'ref_only') && (
          <div className="map-pane map-pane-left">
            <div className="map-badge-overlay">
              <span className="map-badge-title">Reference Map</span>
              <span className="map-badge-tag">OpenStreetMap / Carto Roads & Names</span>
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
    </div>
  );
}
