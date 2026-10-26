import React from 'react';
import { ShieldCheck, HeartPulse, TreePine, Droplet, Building, BookOpen, AlertOctagon, Check } from 'lucide-react';

export default function ActionRecommendations() {
  const actionsImmediate = [
    {
      title: "Public Heat-Health Alerts & Hydration Points",
      target: "Residents & Informal Outdoor Workers (Panchavati, Satpur, CBS Bus Stand)",
      desc: "Implement color-coded alert dissemination (Yellow/Orange/Red) via SMS/WhatsApp based on IMD heat wave thresholds. Establish free Oral Rehydration Solution (ORS) and drinking water booths at high-footfall transit interchanges (Nashik Central Bus Station, CBS, Old CBS, Shalimar).",
      timeline: "Immediate Operational",
      citation: "NDMA National Heat Wave Guidelines 2024 & NMC Disaster Management Plan"
    },
    {
      title: "Rescheduling Outdoor Labor Hours (12:00 PM – 4:00 PM)",
      target: "Construction Labor, Street Vendors, Agricultural Harvesters (Niphad/Yeola)",
      desc: "Enforce mandatory rest breaks during peak irradiance hours (12:00 PM to 4:00 PM) for municipal sanitation staff, construction workers, and agricultural labor, with shaded rest shelters equipped with clean water and first-aid kits.",
      timeline: "Immediate Operational",
      citation: "Ministry of Labour & Employment Advisory / NDMA Heat Wave Framework"
    },
    {
      title: "Primary Healthcare Readiness for Heat-Stroke Management",
      target: "District Civil Hospital, Bytco Hospital, UPHCs",
      desc: "Equip all Urban Primary Health Centres (UPHCs) with dedicated cooling beds, ice packs, intravenous fluids, and staff trained in the rapid recognition of heat exhaustion and exertional heat stroke.",
      timeline: "Immediate Operational",
      citation: "Integrated Disease Surveillance Programme (IDSP) / IMD Heat-Health Protocol"
    }
  ];

  const actionsLongTerm = [
    {
      title: "Targeted High-Albedo Cool Roof Program",
      target: "Satpur & Ambad MIDC Industrial Sheds & Low-Income Slum Settlements",
      desc: "Apply solar reflective white coatings (solar reflectance index SRI > 82) on galvanized tin and corrugated sheet roofs. In Satpur/Ambad, unshaded tin roofs reach 51°C LST; empirical cool-roof field trials in Ahmedabad demonstrate indoor ambient reductions of 2.5°C – 4.0°C.",
      timeline: "Medium-Term (1–2 Years)",
      citation: "IIPH Gandhinagar Cool Roofs Program & Mahila Housing Trust (MHT)"
    },
    {
      title: "Urban Forest Corridors & Godavari Riparian Buffer",
      target: "Godavari Riverbanks (Someshwar to Tapovan), Canal Networks & Ring Roads",
      desc: "Expand multi-tiered native vegetation buffers (Neem, Banyan, Peepal, Karanj, Jamun) along the Godavari River corridor. Our spatial analysis demonstrates that riparian tree buffers suppress local surface temperatures by 2.3°C to 3.8°C over a 400m radius.",
      timeline: "Long-Term (3–5 Years)",
      citation: "Nashik Municipal Corporation Urban Greening Policy & MoEFCC Urban Forest Scheme"
    },
    {
      title: "Permeable Pavements & Cool Transit Stops",
      target: "NMC Public Parking Lots, Commercial Plazas & Citylink Bus Shelters",
      desc: "Mandate permeable interlocking concrete pavers and green shading trellises at all newly constructed city bus terminals (Citylink), parking lots, and pedestrian walkways to replace dense black asphalt.",
      timeline: "Medium-Term (2–3 Years)",
      citation: "Town and Country Planning Organisation (TCPO) Climate-Resilient Urban Infrastructure"
    },
    {
      title: "Conservation of Wetlands and Infiltration Basins",
      target: "Gangapur Dam catchment, Kadva reservoir, Darna floodplain",
      desc: "Strictly preserve water bodies and natural drainage swales from illegal silt dumping and unauthorized encroachment. Water bodies provide evaporative cooling anchors for downwind settlements.",
      timeline: "Long-Term (Ongoing Policy)",
      citation: "Maharashtra State Water Policy & Wetland Conservation Rules"
    }
  ];

  return (
    <div className="card-panel" id="action-recommendations-panel" style={{ maxWidth: '1200px', margin: '0 auto', gap: '1.75rem' }}>
      <div className="card-header">
        <div>
          <div className="card-title" style={{ fontSize: '1.25rem' }}>
            <ShieldCheck size={22} color="#10b981" />
            Evidence-Based Heat Action & Mitigation Recommendations
          </div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
            Tailored interventions for Nashik District, connecting observed satellite spatial hotspots with authoritative heat-health and climate adaptation frameworks.
          </div>
        </div>
      </div>

      {/* Immediate Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
          <HeartPulse size={18} color="#ea580c" />
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: '#fed7aa' }}>
            Immediate Heat-Safety Protocols (0 – 30 Days)
          </h3>
        </div>
        <div className="rec-grid">
          {actionsImmediate.map((act, i) => (
            <div key={i} className="rec-card" style={{ borderLeft: '3px solid #ea580c' }}>
              <div className="rec-card-header">
                <span className="rec-title">{act.title}</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#fb923c', fontWeight: 600 }}>
                Target: {act.target}
              </div>
              <div className="rec-body">{act.desc}</div>
              <div className="rec-citation">
                <BookOpen size={12} /> {act.citation}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Long Term Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
          <TreePine size={18} color="#34d399" />
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: '#a7f3d0' }}>
            Long-Term Urban Cooling & Spatial Planning Interventions (1 – 5 Years)
          </h3>
        </div>
        <div className="rec-grid">
          {actionsLongTerm.map((act, i) => (
            <div key={i} className="rec-card" style={{ borderLeft: '3px solid #10b981' }}>
              <div className="rec-card-header">
                <span className="rec-title">{act.title}</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#34d399', fontWeight: 600 }}>
                Target: {act.target}
              </div>
              <div className="rec-body">{act.desc}</div>
              <div className="rec-citation">
                <BookOpen size={12} /> {act.citation}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
