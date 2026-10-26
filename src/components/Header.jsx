import React from 'react';
import { Flame, CheckCircle2, FileText, Download, BarChart3, Map, Lightbulb, Database } from 'lucide-react';

export default function Header({
  activeTab,
  setActiveTab,
  onOpenMethodology,
  onOpenExport
}) {
  return (
    <header className="header-bar" id="app-header">
      <div className="header-inner">
        <div className="brand-section">
          <div className="brand-logo-icon">
            <Flame size={24} color="#ffffff" />
          </div>
          <div className="brand-text">
            <h1>
              Urban Heat Mapper
              <span style={{ fontSize: '0.85rem', fontWeight: 400, color: '#fed7aa' }}>— Nashik District</span>
            </h1>
            <div className="brand-subtitle">
              <span>Maharashtra, India</span>
              <span className="badge-tag badge-verified">
                <CheckCircle2 size={11} /> Boundary Verified
              </span>
              <span style={{ color: '#475569' }}>•</span>
              <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}>Landsat C2 L2 & IMD Gridded</span>
            </div>
          </div>
        </div>

        <nav className="nav-actions" aria-label="Main Navigation">
          <button
            className={`btn-nav ${activeTab === 'maps' ? 'active' : ''}`}
            onClick={() => setActiveTab('maps')}
            id="nav-tab-maps"
          >
            <Map size={14} /> Dual Maps
          </button>
          <button
            className={`btn-nav ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
            id="nav-tab-analytics"
          >
            <BarChart3 size={14} /> Driver Analytics
          </button>
          <button
            className={`btn-nav ${activeTab === 'conclusions' ? 'active' : ''}`}
            onClick={() => setActiveTab('conclusions')}
            id="nav-tab-conclusions"
          >
            <FileText size={14} /> Plain Conclusions
          </button>
          <button
            className={`btn-nav ${activeTab === 'actions' ? 'active' : ''}`}
            onClick={() => setActiveTab('actions')}
            id="nav-tab-actions"
          >
            <Lightbulb size={14} /> Heat Actions
          </button>
          <button
            className="btn-nav"
            onClick={onOpenMethodology}
            id="nav-btn-methodology"
          >
            <Database size={14} /> Data Sources & Methodology
          </button>
          <button
            className="btn-primary"
            onClick={onOpenExport}
            id="nav-btn-export"
          >
            <Download size={14} /> Export Results
          </button>
        </nav>
      </div>
    </header>
  );
}
