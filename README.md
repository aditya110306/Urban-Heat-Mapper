# 🏙️ Urban Heat Mapper — Nashik District, Maharashtra

An interactive geospatial intelligence platform and decision-support system designed to analyze urban heat dynamics across **Nashik District, Maharashtra, India**. The system couples satellite radiometric Land Surface Temperature (LST) from **Landsat 8/9 Collection 2 Level-2**, meteorological ambient air temperature grids from the **India Meteorological Department (IMD Pune)**, high-resolution **Sentinel-2 NDVI**, **Copernicus DEM**, and **Uber H3 spatial indexing** to inform evidence-based urban heat mitigation.

👉 **[View Complete Chat History & Project Activity Log](file:///d:/Projects/Urban%20Heat%20Mapper%20V1/CHAT_HISTORY.md)**

---

## 🌟 Key Features

1. **Strict Administrative Clipping:**
   - Analysis is clipped strictly to the official **Nashik District** administrative boundary verified via Survey of India and the National Water Data Portal (India WRIS).
   - Covers all 15 talukas: *Nashik, Malegaon, Sinnar, Niphad, Yeola, Dindori, Igatpuri, Trimbakeshwar, Kalwan, Baglan (Satana), Chandwad, Deola, Nandgaon, Surgana, and Peth*.
2. **Synchronized Dual Maps:**
   - **Reference Map:** Conventional street map showing roads, settlements, water bodies, and taluka boundaries (OpenStreetMap / Carto / Satellite).
   - **Heat Map:** Uber H3 hexagonal cells colored by active thermal or biophysical metrics.
   - Real-time pan & zoom synchronization with side-by-side split and single-map toggle views.
3. **Uber H3 Spatial Hexagonal Aggregation:**
   - **Resolution 7 (~1.2 km cell diameter):** 3,254 cells covering the entire 15,530 km² district area.
   - **Resolution 8 (~460m cell diameter):** 734 focal cells focused on dense urban cores (Nashik City & Malegaon).
4. **Radiometric Skin vs. Ambient Shaded Air Temperature:**
   - Rigorously distinguishes **Land Surface Temperature (LST)** from **Air Temperature ($T_{air}$)** throughout maps, statistics, and conclusions.
   - Explains the observed **7°C to 11°C skin-air temperature excess** in unshaded asphalt and industrial sheet roofs.
5. **Statistical Driver Associations:**
   - Pearson correlation analysis ($r$) against Impervious Built-Up Area, Vegetation (NDVI), Topographic Elevation, Distance to Water Bodies, and Population Density.
6. **Plain-Language Synthesis & Action Recommendations:**
   - Answers 5 key policy questions for residents and decision-makers.
   - Separates immediate heat-health emergency protocols (0–30 days) from long-term urban cooling interventions (1–5 years) citing **NDMA National Heat Wave Guidelines 2024**, **NMC Heat Resilience Framework**, and **IIPH Gandhinagar**.
7. **Complete Data Transparency & Open Exports:**
   - Export processed H3 GeoJSON layers (Res 7 & Res 8), summary CSVs, and executive markdown reports.

---

## 📊 Public Datasets & Transparency Matrix

| Layer | Provider | Source URL | Resolution | Temporal Coverage | Units | Access Policy |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **District Boundary** | Survey of India / NWDP | [indiawris.gov.in](https://indiawris.gov.in/) | 1:50,000 vector | 2024 Census Framework | WGS84 GeoJSON | Open Govt Data (OGD) |
| **Satellite LST** | USGS / NASA Landsat 8/9 C2 L2 | [GEE Catalog](https://developers.google.com/earth-engine/datasets/catalog/LANDSAT_LC08_C02_T1_L2) | 100m resampled to 30m | 2019–2024 Multi-Year | Degrees Celsius (°C) | Open CC0 / GEE Auth |
| **Air Temperature & Rain** | India Meteorological Dept (IMD) | [imdpune.gov.in](https://www.imdpune.gov.in/) | 0.25° grid (~27 km) | 2019–2024 Daily/Seasonal | °C, mm/year | Free Research Profile |
| **Vegetation (NDVI)** | ESA Copernicus Sentinel-2 | [Copernicus CDSE](https://dataspace.copernicus.eu/) | 10m native | 2019–2024 Composites | Index (-1 to +1) | Open Copernicus Policy |
| **Built-up Area** | JRC GHSL & OpenStreetMap | [ghsl.jrc.ec.europa.eu](https://ghsl.jrc.ec.europa.eu/) | 10m / 100m | 2020–2024 | Impervious % | Open Database License |
| **Elevation (DEM)** | Copernicus GLO-30 DEM | [Copernicus Space Data](https://spacedata.copernicus.eu/) | 30m grid | Static Topography | Meters ASL (m) | Open Access |
| **Population Density** | WorldPop / Census India | [worldpop.org](https://www.worldpop.org/) | 100m grid | 2024 Projections | Persons / km² | CC BY 4.0 |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+) and npm
- Python 3.10+ with geospatial libraries (`geopandas`, `h3`, `numpy`)

### 1. Run Data Ingestion & Processing Pipeline
```bash
# Extract and verify official Nashik District boundary
python pipeline/extract_nashik_boundary.py

# Process Landsat thermal data, H3 indexing, driver correlations, and exports
python pipeline/process_heat_data.py

# View primary Earth Engine and IMD access guide
python pipeline/download_imd_landsat_guide.py
```

### 2. Run Interactive Web Dashboard
```bash
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🗂️ Project Directory Structure

```text
Urban Heat Mapper V1/
├── pipeline/
│   ├── extract_nashik_boundary.py      # Clips and validates official Nashik boundary
│   ├── process_heat_data.py             # Generates H3 Res 7/8 cells, thermal metrics, correlations
│   └── download_imd_landsat_guide.py   # Setup scripts for Earth Engine, STAC, and IMD
├── public/
│   └── data/
│       ├── nashik_district_boundary.geojson  # Verified district boundary
│       ├── nashik_h3_res7.json               # District-wide H3 Res 7 cells (3,254 cells)
│       ├── nashik_h3_res8.json               # Urban focal H3 Res 8 cells (734 cells)
│       ├── nashik_talukas.json               # 15 Taluka centroids & vulnerability rankings
│       ├── driver_correlations.json          # Statistical Pearson r correlations & p-values
│       ├── dataset_metadata.json             # Dataset transparency matrix
│       └── nashik_heat_summary.csv           # Downloadable summary spreadsheet
├── src/
│   ├── components/
│   │   ├── DualMapViewer.jsx           # Synchronized Leaflet maps, legend, inspector
│   │   ├── Header.jsx                  # Navigation, verification badges, actions
│   │   ├── ControlBar.jsx              # Seasons, metrics, H3 resolution, taluka filter
│   │   ├── AnalyticsPanel.jsx          # Correlation matrix, surface vs air analysis, ranking table
│   │   ├── ConclusionsReport.jsx       # 5 Plain-language answers
│   │   ├── ActionRecommendations.jsx   # Immediate vs long-term recommendations
│   │   ├── MethodologyModal.jsx        # Data sources, formulas, setup instructions
│   │   └── ExportModal.jsx             # Downloads for GeoJSON, CSV, markdown reports
│   ├── utils/
│   │   └── colorScales.js              # Perceptual color scales & metric ranges
│   ├── App.jsx                         # Main application layout and state manager
│   ├── index.css                       # Precision glassmorphic styling system
│   └── main.jsx                        # React root entry
├── index.html                          # Meta description, Outfit/Inter typography, Leaflet CSS
└── package.json
```

---

## 📄 License & Attribution
- Project code: MIT License.
- Datasets are credited to their respective primary providers: USGS/NASA, IMD Pune, ESA Copernicus, and Survey of India.
