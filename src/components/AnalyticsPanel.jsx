import React from 'react';
import { BarChart3, TrendingUp, AlertCircle, ShieldAlert, ThermometerSun, Leaf, Building2, Mountain, Droplets, Users } from 'lucide-react';

export default function AnalyticsPanel({ correlationData }) {
  if (!correlationData) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Loading driver analytics...</div>;
  }

  const drivers = correlationData.drivers || [];
  const rankings = correlationData.taluka_rankings || [];

  const getDriverIcon = (name) => {
    if (name.includes('Built-Up')) return <Building2 size={16} color="#f87171" />;
    if (name.includes('Vegetation') || name.includes('NDVI')) return <Leaf size={16} color="#34d399" />;
    if (name.includes('Elevation')) return <Mountain size={16} color="#38bdf8" />;
    if (name.includes('Water')) return <Droplets size={16} color="#60a5fa" />;
    if (name.includes('Population')) return <Users size={16} color="#c084fc" />;
    return <ThermometerSun size={16} color="#fb923c" />;
  };

  return (
    <div className="analytics-section" id="analytics-section-wrapper">
      {/* Driver Correlations Card */}
      <div className="card-panel">
        <div className="card-header">
          <div className="card-title">
            <BarChart3 size={18} color="#f97316" />
            Statistical Associations with Surface Temperature (LST)
          </div>
          <span className="badge-tag badge-warning">
            <AlertCircle size={10} /> Correlational — Not Causal
          </span>
        </div>

        <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '1rem', lineHeight: '1.45' }}>
          Pearson correlation coefficients ($r$) calculated across 3,254 H3 hexagonal cells for Nashik District against Landsat Collection 2 Peak Summer Surface Temperature. These report observed <b>associations</b> and must not be interpreted as solitary causal factors without multivariate energy balance modeling.
        </p>

        <div className="driver-list">
          {drivers.map((d, idx) => {
            const isPos = d.pearson_r > 0;
            const rClass = Math.abs(d.pearson_r) >= 0.65 ? (isPos ? 'pos-strong' : 'neg-strong') : 'mod';

            return (
              <div key={idx} className="driver-item">
                <div className="driver-top">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    {getDriverIcon(d.variable)}
                    <span className="driver-name">{d.variable}</span>
                  </div>
                  <span className={`driver-r ${rClass}`}>
                    r = {d.pearson_r > 0 ? `+${d.pearson_r}` : d.pearson_r} ({d.association_direction})
                  </span>
                </div>
                <div className="driver-desc">{d.interpretation}</div>
                <div style={{ fontSize: '0.68rem', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Source: {d.source}</span>
                  <span>Statistical Significance: p {d.p_value}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Surface vs Air Temperature Comparison Box */}
      <div className="card-panel">
        <div className="card-header">
          <div className="card-title">
            <ThermometerSun size={18} color="#38bdf8" />
            Land Surface Temp (LST) vs. Shaded Air Temp ($T_{'{air}'}$)
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ fontSize: '0.84rem', color: '#fed7aa', marginBottom: '0.35rem' }}>
              Why do Satellite LST and IMD Weather Data differ?
            </h4>
            <p style={{ fontSize: '0.76rem', color: '#94a3b8', lineHeight: '1.45' }}>
              <b>Land Surface Temperature (LST):</b> Measured from satellite radiometric sensors (Landsat 8/9 Band 10). It measures the thermodynamic skin temperature of surfaces directly struck by sunlight (asphalt, concrete roofs, bare soil). In May midday, urban roofs in Satpur MIDC reach <b>48°C – 52°C</b>.
              <br/><br/>
              <b>Ambient Air Temperature ($T_{'{air}'}$):</b> Measured by the India Meteorological Department (IMD) at 1.5 to 2 meters above ground inside a shaded, naturally ventilated wooden Stevenson screen. Peak summer air temperatures in Nashik typically range from <b>37°C – 41°C</b>.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem' }}>
            <div className="stat-box">
              <div className="stat-box-label">Peak Summer Skin-Air Gap</div>
              <div className="stat-box-value hot">+7.8 °C to +11.2 °C</div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '2px' }}>Midday asphalt/roof excess heat</div>
            </div>
            <div className="stat-box">
              <div className="stat-box-label">Monsoon Thermal Gap</div>
              <div className="stat-box-value cool">+1.2 °C to +3.5 °C</div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '2px' }}>Narrowed by rain, wet ground & clouds</div>
            </div>
          </div>

          <div style={{ background: 'rgba(56, 189, 248, 0.08)', borderLeft: '3px solid #38bdf8', padding: '0.65rem', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0', fontSize: '0.74rem', color: '#bae6fd' }}>
            <b>Essential Planning Caveat:</b> Urban planners should use LST to locate micro-urban hotspots, localized impervious clusters, and target cool roof/greening interventions. For physiological heat-stroke and human exposure alerts, refer to IMD shaded air temperature and Wet-Bulb Globe Temperature (WBGT).
          </div>
        </div>
      </div>

      {/* Taluka Vulnerability Table */}
      <div className="card-panel" style={{ gridColumn: '1 / -1' }}>
        <div className="card-header">
          <div className="card-title">
            <ShieldAlert size={18} color="#ea580c" />
            Nashik District Taluka Heat Vulnerability Rankings (15 Talukas)
          </div>
          <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
            Ranked by Mean Peak Summer Land Surface Temperature
          </span>
        </div>

        <div className="taluka-table-wrapper">
          <table className="data-table" id="taluka-rankings-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Taluka</th>
                <th>H3 Cells</th>
                <th>Summer LST (Mean)</th>
                <th>Summer LST (Max)</th>
                <th>IMD Air Temp</th>
                <th>Impervious Built %</th>
                <th>Vegetation (NDVI)</th>
                <th>5-Yr ΔT Change</th>
                <th>Vulnerability Tier</th>
              </tr>
            </thead>
            <tbody>
              {rankings.map((t, idx) => {
                let badgeClass = 'badge-warning';
                if (t.heat_vulnerability === 'Extreme') badgeClass = 'badge-tag' && { background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.4)' };
                else if (t.heat_vulnerability === 'High') badgeClass = 'badge-tag' && { background: 'rgba(249, 115, 22, 0.2)', color: '#fb923c', border: '1px solid rgba(249, 115, 22, 0.4)' };
                else if (t.heat_vulnerability === 'Low') badgeClass = 'badge-tag' && { background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.4)' };
                else badgeClass = 'badge-tag' && { background: 'rgba(234, 179, 8, 0.2)', color: '#facc15', border: '1px solid rgba(234, 179, 8, 0.4)' };

                return (
                  <tr key={t.taluka}>
                    <td style={{ fontWeight: 700, color: '#94a3b8' }}>#{idx + 1}</td>
                    <td style={{ fontWeight: 600, color: '#f8fafc' }}>{t.taluka}</td>
                    <td style={{ fontFamily: 'monospace' }}>{t.cell_count}</td>
                    <td style={{ fontWeight: 700, color: t.mean_summer_lst_c >= 44 ? '#f87171' : '#fb923c' }}>
                      {t.mean_summer_lst_c} °C
                    </td>
                    <td style={{ color: '#ef4444', fontWeight: 600 }}>{t.max_summer_lst_c} °C</td>
                    <td style={{ color: '#38bdf8' }}>{t.mean_air_temp_c} °C</td>
                    <td>{t.mean_built_up_pct}%</td>
                    <td style={{ color: '#34d399' }}>{t.mean_ndvi}</td>
                    <td style={{ color: '#f97316', fontWeight: 600 }}>+{t.mean_change_5yr_c} °C</td>
                    <td>
                      <span className="badge-tag" style={badgeClass}>
                        {t.heat_vulnerability}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
