import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ControlBar from './components/ControlBar';
import DualMapViewer from './components/DualMapViewer';
import AnalyticsPanel from './components/AnalyticsPanel';
import ConclusionsReport from './components/ConclusionsReport';
import ActionRecommendations from './components/ActionRecommendations';
import MethodologyModal from './components/MethodologyModal';
import ExportModal from './components/ExportModal';
import { AlertCircle, ExternalLink, ShieldCheck, Thermometer } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('maps');
  const [activeMetric, setActiveMetric] = useState('lst_summer_mean');
  const [selectedSeason, setSelectedSeason] = useState('summer');
  const [h3Resolution, setH3Resolution] = useState(7);
  const [selectedTaluka, setSelectedTaluka] = useState('ALL');
  const [selectedCell, setSelectedCell] = useState(null);

  const [geoDataRes7, setGeoDataRes7] = useState(null);
  const [geoDataRes8, setGeoDataRes8] = useState(null);
  const [districtBoundary, setDistrictBoundary] = useState(null);
  const [talukasData, setTalukasData] = useState(null);
  const [correlations, setCorrelations] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Fetch initial datasets
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [resBoundary, resH3Res7, resH3Res8, resTalukas, resCorr, resMeta] = await Promise.all([
          fetch('/data/nashik_district_boundary.geojson').then(r => r.json()),
          fetch('/data/nashik_h3_res7.json').then(r => r.json()),
          fetch('/data/nashik_h3_res8.json').then(r => r.json()),
          fetch('/data/nashik_talukas.json').then(r => r.json()),
          fetch('/data/driver_correlations.json').then(r => r.json()),
          fetch('/data/dataset_metadata.json').then(r => r.json())
        ]);

        setDistrictBoundary(resBoundary);
        setGeoDataRes7(resH3Res7);
        setGeoDataRes8(resH3Res8);
        setTalukasData(resTalukas);
        setCorrelations(resCorr);
        setMetadata(resMeta);
      } catch (err) {
        console.error('Failed to load Nashik geospatial datasets:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter H3 layer by Taluka if requested
  const baseGeoData = h3Resolution === 8 ? geoDataRes8 : geoDataRes7;
  const filteredGeoData = React.useMemo(() => {
    if (!baseGeoData) return null;
    if (selectedTaluka === 'ALL') return baseGeoData;

    return {
      ...baseGeoData,
      features: baseGeoData.features.filter(
        f => f.properties.taluka.toLowerCase() === selectedTaluka.toLowerCase()
      )
    };
  }, [baseGeoData, selectedTaluka]);

  const talukaList = [
    'Nashik', 'Malegaon', 'Sinnar', 'Niphad', 'Yeola',
    'Dindori', 'Igatpuri', 'Trimbakeshwar', 'Kalwan',
    'Baglan (Satana)', 'Chandwad', 'Deola', 'Nandgaon', 'Surgana', 'Peth'
  ];

  return (
    <div className="app-container" id="urban-heat-mapper-app">
      {/* Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenMethodology={() => setIsMethodologyOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
      />

      {/* Transparency Disclaimer Banner */}
      <div className="disclaimer-banner" id="scientific-disclaimer-strip">
        <div className="disclaimer-inner">
          <div className="disclaimer-text">
            <span className="disclaimer-highlight">Spatial Boundary:</span>
            <span>Nashik District, Maharashtra only (verified Survey of India boundary clipped).</span>
            <span style={{ color: '#475569' }}>|</span>
            <span className="disclaimer-highlight">Measurement Distinction:</span>
            <span>
              Satellite Land Surface Temperature (radiometric skin temp, Landsat C2 L2 30m) is strictly distinguished from ambient shaded air temperature (IMD Pune 0.25° grid).
            </span>
          </div>
          <button
            onClick={() => setIsMethodologyOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              color: '#38bdf8',
              cursor: 'pointer',
              fontSize: '0.74rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              textDecoration: 'underline'
            }}
          >
            Read Methodology & Limitations <ExternalLink size={11} />
          </button>
        </div>
      </div>

      {/* Main Content Body */}
      <main className="main-workspace">
        {loading ? (
          <div style={{ padding: '6rem 2rem', textAlign: 'center', color: '#94a3b8' }}>
            <div style={{ fontSize: '1.25rem', color: '#fed7aa', fontWeight: 600, marginBottom: '0.5rem' }}>
              Loading Nashik District Geospatial Cube & H3 Cells...
            </div>
            <p style={{ fontSize: '0.85rem' }}>
              Calibrating Landsat Collection 2 Level-2 Surface Temperatures and IMD Climate Grids
            </p>
          </div>
        ) : (
          <>
            {/* Maps Tab */}
            {activeTab === 'maps' && (
              <>
                <ControlBar
                  activeMetric={activeMetric}
                  setActiveMetric={setActiveMetric}
                  selectedSeason={selectedSeason}
                  setSelectedSeason={setSelectedSeason}
                  h3Resolution={h3Resolution}
                  setH3Resolution={setH3Resolution}
                  selectedTaluka={selectedTaluka}
                  setSelectedTaluka={setSelectedTaluka}
                  talukas={talukaList}
                />

                <DualMapViewer
                  geoData={filteredGeoData}
                  districtBoundary={districtBoundary}
                  activeMetric={activeMetric}
                  h3Resolution={h3Resolution}
                  selectedCell={selectedCell}
                  onSelectCell={setSelectedCell}
                  talukasData={talukasData}
                />
              </>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <AnalyticsPanel correlationData={correlations} />
            )}

            {/* Plain-Language Conclusions Tab */}
            {activeTab === 'conclusions' && (
              <ConclusionsReport />
            )}

            {/* Action Recommendations Tab */}
            {activeTab === 'actions' && (
              <ActionRecommendations />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="footer-bar" id="app-footer">
        <div style={{ maxWidth: '1720px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <b>Urban Heat Mapper — Nashik District</b> • Public Climate & Geospatial Intelligence
          </div>
          <div>
            Sources: USGS/NASA Landsat 8/9 C2 L2 • IMD Pune • ESA Sentinel-2 • Copernicus GLO-30 DEM • Survey of India
          </div>
        </div>
      </footer>

      {/* Modals */}
      <MethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
        metadata={metadata}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
}
