import React from 'react';
import { METRIC_CONFIGS } from '../utils/colorScales';
import { Sun, CloudRain, Wind, Snowflake, Layers, Sliders, Calendar, Sparkles } from 'lucide-react';

export default function ControlBar({
  activeMetric,
  setActiveMetric,
  selectedSeason,
  setSelectedSeason,
  h3Resolution,
  setH3Resolution,
  selectedTaluka,
  setSelectedTaluka,
  talukas = []
}) {
  const seasons = [
    { id: 'summer', label: 'Peak Summer (Mar–May)', icon: Sun, metricKey: 'lst_summer_mean' },
    { id: 'monsoon', label: 'Monsoon (Jun–Sep)', icon: CloudRain, metricKey: 'lst_monsoon_mean' },
    { id: 'postmonsoon', label: 'Post-Monsoon (Oct–Nov)', icon: Wind, metricKey: 'lst_postmonsoon_mean' },
    { id: 'winter', label: 'Winter (Dec–Feb)', icon: Snowflake, metricKey: 'lst_winter_mean' }
  ];

  const handleSeasonChange = (s) => {
    setSelectedSeason(s.id);
    if (activeMetric.startsWith('lst_') && !activeMetric.includes('change')) {
      setActiveMetric(s.metricKey);
    }
  };

  return (
    <section className="controls-card" id="mapper-controls-card">
      <div className="controls-row-top">
        {/* Season Selector */}
        <div className="control-group">
          <span className="control-label">
            <Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} />
            Time Period / Season:
          </span>
          <div className="pill-group" role="group" aria-label="Season selection">
            {seasons.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  className={`pill-btn ${selectedSeason === s.id ? 'active' : ''}`}
                  onClick={() => handleSeasonChange(s)}
                  id={`btn-season-${s.id}`}
                >
                  <Icon size={12} />
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* H3 Resolution Toggle */}
        <div className="control-group">
          <span className="control-label">
            <Layers size={12} style={{ display: 'inline', marginRight: '4px' }} />
            Uber H3 Grid Resolution:
          </span>
          <div className="pill-group" role="group" aria-label="H3 resolution toggle">
            <button
              className={`pill-btn ${h3Resolution === 7 ? 'active' : ''}`}
              onClick={() => setH3Resolution(7)}
              title="Resolution 7 (~1.2 km diameter) covers entire 15,530 km² Nashik District"
              id="btn-res-7"
            >
              Res 7 (~1.2 km District)
            </button>
            <button
              className={`pill-btn ${h3Resolution === 8 ? 'active' : ''}`}
              onClick={() => setH3Resolution(8)}
              title="Resolution 8 (~460m diameter) urban neighborhood focal layer"
              id="btn-res-8"
            >
              Res 8 (~460m Urban Focal)
            </button>
          </div>
        </div>

        {/* Taluka Quick Filter */}
        <div className="control-group">
          <span className="control-label">Filter Taluka:</span>
          <select
            value={selectedTaluka}
            onChange={(e) => setSelectedTaluka(e.target.value)}
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid var(--border-subtle)',
              color: '#f8fafc',
              padding: '0.35rem 0.65rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.78rem',
              outline: 'none'
            }}
            id="select-taluka-filter"
          >
            <option value="ALL">All Nashik District (15 Talukas)</option>
            {talukas.map((t) => (
              <option key={t} value={t}>
                {t} Taluka
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Metric Selector Chips */}
      <div className="controls-row-metrics" role="group" aria-label="Metric Selection">
        <span className="control-label" style={{ whiteSpace: 'nowrap' }}>
          <Sliders size={12} style={{ display: 'inline', marginRight: '4px' }} />
          Select Heat / Biophysical Layer:
        </span>

        {Object.entries(METRIC_CONFIGS).map(([key, config]) => {
          let chipClass = '';
          if (activeMetric === key) {
            if (config.category === 'satellite') chipClass = 'active-lst';
            else if (config.category === 'meteorological') chipClass = 'active-air';
            else chipClass = 'active-eco';
          }

          return (
            <button
              key={key}
              className={`metric-chip ${activeMetric === key ? `active ${chipClass}` : ''}`}
              onClick={() => setActiveMetric(key)}
              title={config.description}
              id={`chip-metric-${key}`}
            >
              <span>{config.shortLabel}</span>
              <span style={{ fontSize: '0.68rem', opacity: 0.75, fontFamily: 'monospace' }}>
                ({config.units})
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
