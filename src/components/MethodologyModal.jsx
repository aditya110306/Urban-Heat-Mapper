import React from 'react';
import { X, Database, Key, Calculator, ExternalLink, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function MethodologyModal({ isOpen, onClose, metadata }) {
  if (!isOpen) return null;

  const datasets = metadata?.datasets || [];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '960px' }}>
        <div className="modal-header">
          <div className="modal-title">
            <Database size={20} color="#f97316" />
            Methodology, Public Data Sources & Verification Guide
          </div>
          <button className="inspector-close-btn" onClick={onClose} title="Close Modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Boundary Verification Notice */}
          <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontWeight: 700, color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
              <CheckCircle2 size={16} /> District Administrative Boundary Verification
            </div>
            <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
              <b>Jurisdiction:</b> Nashik District, Maharashtra, India (Census ID 326).
              <br />
              <b>Boundary Source:</b> Official Survey of India / National Water Data Portal (India WRIS) vector boundaries. Verified in EPSG:4326 (WGS 84). All spatial analysis and H3 hexagonal aggregations are strictly clipped to this polygon boundary. No adjacent districts (Dhule, Jalgaon, Ahmednagar, Thane, Palghar) are included in this initial analysis.
            </div>
          </div>

          {/* Dataset Inventory Table */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.98rem', color: '#f8fafc', marginBottom: '0.5rem' }}>
              Public Datasets & Transparency Matrix
            </h3>
            <div className="taluka-table-wrapper" style={{ maxHeight: '280px', overflowY: 'auto' }}>
              <table className="data-table" style={{ fontSize: '0.74rem' }}>
                <thead>
                  <tr>
                    <th>Layer</th>
                    <th>Provider</th>
                    <th>Spatial Res.</th>
                    <th>Time Period</th>
                    <th>Units</th>
                    <th>Authentication / Access</th>
                  </tr>
                </thead>
                <tbody>
                  {datasets.map((d) => (
                    <tr key={d.id}>
                      <td style={{ fontWeight: 600, color: '#fed7aa' }}>{d.dataset_name}</td>
                      <td>{d.provider}</td>
                      <td style={{ fontFamily: 'monospace' }}>{d.spatial_resolution}</td>
                      <td>{d.time_coverage}</td>
                      <td style={{ color: '#38bdf8' }}>{d.units}</td>
                      <td style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{d.authentication}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mathematical Formulations */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.98rem', color: '#f8fafc', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Calculator size={16} color="#38bdf8" /> Calibration & Aggregation Formulations
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
              <div className="code-box">
                <div style={{ color: '#fed7aa', fontWeight: 600, marginBottom: '4px' }}>
                  1. Landsat C2 L2 Thermal Calibration
                </div>
                <code>
                  LST (Kelvin) = DN * 0.00341802 + 149.0<br />
                  LST (°C) = LST (Kelvin) - 273.15
                </code>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '4px' }}>
                  Applied to Band 10 (TIRS) with QA_PIXEL cloud & shadow masking.
                </div>
              </div>

              <div className="code-box">
                <div style={{ color: '#fed7aa', fontWeight: 600, marginBottom: '4px' }}>
                  2. Sentinel-2 Vegetation Index (NDVI)
                </div>
                <code>
                  NDVI = (Band 8 NIR - Band 4 Red) / (Band 8 + Band 4)
                </code>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '4px' }}>
                  Native 10m spatial resolution cloud-free composite.
                </div>
              </div>
            </div>
          </div>

          {/* Setup Guide for APIs & Earth Engine */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.98rem', color: '#f8fafc', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Key size={16} color="#fbbf24" /> Setup Instructions for Primary Sources
            </h3>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.76rem', color: '#cbd5e1', lineHeight: '1.5' }}>
              <p><b>1. Google Earth Engine (Landsat Collection 2):</b> Create a Google Cloud project and enable Earth Engine API. Authenticate via <code>earthengine authenticate</code> or Python SDK <code>ee.Initialize()</code>.</p>
              <p style={{ marginTop: '0.4rem' }}><b>2. India Meteorological Department (IMDWeb Pune):</b> Register a free research profile at <code>https://www.imdpune.gov.in/</code> to download daily 0.25° binary grid archives.</p>
              <p style={{ marginTop: '0.4rem' }}><b>3. Microsoft Planetary Computer STAC:</b> Accessible anonymously with <code>pystac-client</code>; no mandatory API key required for standard imagery searches.</p>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose}>
            Close Methodology
          </button>
        </div>
      </div>
    </div>
  );
}
