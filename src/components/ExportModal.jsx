import React, { useState } from 'react';
import { X, Download, FileSpreadsheet, FileCode, FileText, Check, Copy } from 'lucide-react';

export default function ExportModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleDownload = (filename, url) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadMarkdownReport = () => {
    const markdownContent = `# Urban Heat Mapper — Nashik District Executive Assessment Report
Generated: 2026-10-26
Jurisdiction: Nashik District, Maharashtra, India (Verified Boundary)
Primary Sources: Landsat 8/9 C2 L2 (USGS/NASA), IMD Gridded Weather (0.25°), Sentinel-2 (10m), Copernicus DEM (30m)

## 1. Executive Summary
- Peak summer radiometric Land Surface Temperature (LST) averages 42.1°C across Nashik District, peaking between 45.5°C and 51.8°C in industrial and densely built urban corridors.
- Satpur MIDC, Ambad MIDC, and CIDCO in Nashik City, along with the Malegaon urban core, form the most pronounced heat hotspots.
- High-elevation Western Ghats regions (Igatpuri, Trimbakeshwar) maintain a thermal buffer of 8°C to 14°C cooler than eastern plains.

## 2. Statistical Driver Associations (Pearson r)
- Impervious Built-Up Area: r = +0.74 (Strong Positive association with higher LST)
- Vegetation Cover (NDVI): r = -0.71 (Strong Negative association; evaporative cooling)
- Topographic Elevation: r = -0.63 (Atmospheric lapse rate cooling ~0.65°C / 100m)
- Distance to Water Bodies: r = +0.48 (Proximity to Godavari / Gangapur Dam provides 1.5°C-2.8°C cooling buffer)

## 3. High-Priority Recommendations
- Immediate: Establish shaded hydration and ORS booths at transit hubs (CBS, Shalimar); shift outdoor labor hours (12 PM - 4 PM) during IMD heatwave alerts.
- Medium-Term: Mandate high-albedo cool roofs on industrial sheds in Satpur/Ambad and slum settlements.
- Long-Term: Develop continuous multi-tiered native riparian green corridors along the Godavari River and preserve natural wetland catchments.
`;

    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    handleDownload('Nashik_Urban_Heat_Assessment_Report.md', url);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        <div className="modal-header">
          <div className="modal-title">
            <Download size={20} color="#f97316" />
            Export Processed Results & Analysis Summary
          </div>
          <button className="inspector-close-btn" onClick={onClose} title="Close Modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
            Download verified, clipped geospatial datasets and executive reports for Nashik District for use in GIS software (QGIS, ArcGIS), Python data cubes, or policy briefings.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
            {/* GeoJSON Res 7 */}
            <div className="rec-card" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FileCode size={24} color="#f97316" />
                <div>
                  <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.86rem' }}>
                    H3 Resolution 7 GeoJSON (District-wide)
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    3,254 cells (~1.2 km diameter) with LST, Air Temp, NDVI, Built-Up, DEM
                  </div>
                </div>
              </div>
              <button
                className="btn-nav active"
                onClick={() => handleDownload('nashik_h3_res7.geojson', '/data/nashik_h3_res7.json')}
                id="btn-download-res7"
              >
                <Download size={13} /> GeoJSON
              </button>
            </div>

            {/* GeoJSON Res 8 */}
            <div className="rec-card" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FileCode size={24} color="#38bdf8" />
                <div>
                  <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.86rem' }}>
                    H3 Resolution 8 GeoJSON (Urban Focal Cores)
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    734 focal cells (~460m diameter) covering Nashik City & Malegaon core
                  </div>
                </div>
              </div>
              <button
                className="btn-nav active"
                onClick={() => handleDownload('nashik_h3_res8.geojson', '/data/nashik_h3_res8.json')}
                id="btn-download-res8"
              >
                <Download size={13} /> GeoJSON
              </button>
            </div>

            {/* CSV Summary */}
            <div className="rec-card" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FileSpreadsheet size={24} color="#34d399" />
                <div>
                  <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.86rem' }}>
                    Complete District Dataset (CSV Spreadsheet)
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    Tabular format with lat/lon centroids, taluka names, and climate indicators
                  </div>
                </div>
              </div>
              <button
                className="btn-nav active"
                onClick={() => handleDownload('nashik_heat_summary.csv', '/data/nashik_heat_summary.csv')}
                id="btn-download-csv"
              >
                <Download size={13} /> CSV
              </button>
            </div>

            {/* Markdown Report */}
            <div className="rec-card" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FileText size={24} color="#eab308" />
                <div>
                  <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.86rem' }}>
                    Executive Analysis Summary Report (.md)
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    Plain-language conclusions, statistical findings, and recommended actions
                  </div>
                </div>
              </div>
              <button
                className="btn-nav active"
                onClick={handleDownloadMarkdownReport}
                id="btn-download-report"
              >
                <Download size={13} /> Report
              </button>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-nav" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
