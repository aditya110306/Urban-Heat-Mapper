/**
 * Color scales and palette generators for Urban Heat Mapper metrics.
 * Uses perceptual color ramps:
 * - Turbo / Thermal for LST and anomalies
 * - Sky / Cyan for Air Temperature
 * - Viridis / Emerald for NDVI
 * - Ember / Orange for Built-up
 * - Terrain for Elevation
 */

export const METRIC_CONFIGS = {
  lst_summer_mean: {
    id: "lst_summer_mean",
    label: "Peak Summer LST (Mean)",
    shortLabel: "Summer LST",
    category: "satellite",
    units: "°C",
    min: 28,
    max: 50,
    gradient: "linear-gradient(90deg, #3b82f6, #06b6d4, #10b981, #eab308, #ea580c, #dc2626)",
    description: "Landsat Collection 2 Level-2 Surface Temperature (radiometric skin temperature) averaged across peak summer (March–May 2024).",
    source: "Landsat 8/9 C2 L2 (100m resampled to 30m by USGS)"
  },
  lst_summer_max: {
    id: "lst_summer_max",
    label: "Peak Summer LST (Max)",
    shortLabel: "Max Summer LST",
    category: "satellite",
    units: "°C",
    min: 32,
    max: 53,
    gradient: "linear-gradient(90deg, #06b6d4, #10b981, #f59e0b, #ea580c, #b91c1c, #7f1d1d)",
    description: "Maximum instantaneous surface temperature recorded in clear-sky summer acquisitions. Highest in unshaded tin roofs and industrial asphalt.",
    source: "Landsat 8/9 C2 L2 TIRS-2"
  },
  thermal_anomaly: {
    id: "thermal_anomaly",
    label: "Surface Urban Heat Island Anomaly",
    shortLabel: "Thermal Anomaly",
    category: "satellite",
    units: "°C",
    min: -6,
    max: 10,
    gradient: "linear-gradient(90deg, #2563eb, #60a5fa, #f1f5f9, #fb923c, #dc2626)",
    description: "Difference between cell surface temperature and the rural agricultural baseline in Nashik District (~38.0°C).",
    source: "Landsat Derived SUHI"
  },
  lst_monsoon_mean: {
    id: "lst_monsoon_mean",
    label: "Monsoon LST (Mean)",
    shortLabel: "Monsoon LST",
    category: "satellite",
    units: "°C",
    min: 22,
    max: 35,
    gradient: "linear-gradient(90deg, #1e3a8a, #3b82f6, #10b981, #f59e0b)",
    description: "Cloud-masked average surface temperature during June–September. Lower due to persistent clouds, rain, and wet soil.",
    source: "Landsat 8/9 C2 L2 (Note: limited clear-sky passes)"
  },
  lst_winter_mean: {
    id: "lst_winter_mean",
    label: "Winter LST (Mean)",
    shortLabel: "Winter LST",
    category: "satellite",
    units: "°C",
    min: 18,
    max: 32,
    gradient: "linear-gradient(90deg, #1d4ed8, #0ea5e9, #34d399, #f59e0b)",
    description: "Average daytime surface temperature in December–February. Illustrates seasonal thermal amplitude.",
    source: "Landsat 8/9 C2 L2"
  },
  lst_change_5yr: {
    id: "lst_change_5yr",
    label: "5-Year Warming Change (2019 → 2024)",
    shortLabel: "5-Yr ΔT Change",
    category: "satellite",
    units: "°C",
    min: 0.0,
    max: 2.8,
    gradient: "linear-gradient(90deg, #10b981, #fef08a, #f97316, #dc2626)",
    description: "Observed change in mean summer surface temperature between 2019 and 2024. Higher values reflect rapid urbanization and vegetation clearing.",
    source: "Landsat Multi-Year Trend"
  },
  air_temp_summer_c: {
    id: "air_temp_summer_c",
    label: "IMD Gridded Air Temperature (Summer)",
    shortLabel: "IMD Air Temp",
    category: "meteorological",
    units: "°C",
    min: 32,
    max: 42,
    gradient: "linear-gradient(90deg, #38bdf8, #818cf8, #f472b6, #fb923c)",
    description: "India Meteorological Department (IMD) 0.25° gridded ambient 2m shaded air temperature. Represents regional air mass, not street microclimate.",
    source: "IMD Pune (0.25° Grid ~27km)"
  },
  ndvi: {
    id: "ndvi",
    label: "Vegetation Index (NDVI)",
    shortLabel: "Vegetation (NDVI)",
    category: "explanatory",
    units: "Index (-1 to 1)",
    min: 0.05,
    max: 0.80,
    gradient: "linear-gradient(90deg, #78350f, #ca8a04, #84cc16, #15803d, #064e3b)",
    description: "Normalized Difference Vegetation Index from Sentinel-2 (10m). Higher values signify dense tree canopy, vineyards, and irrigated crops.",
    source: "Copernicus Sentinel-2 L2A (10m)"
  },
  built_up_pct: {
    id: "built_up_pct",
    label: "Impervious Built-Up Area",
    shortLabel: "Built-up %",
    category: "explanatory",
    units: "%",
    min: 0,
    max: 95,
    gradient: "linear-gradient(90deg, #f1f5f9, #cbd5e1, #94a3b8, #f97316, #b91c1c)",
    description: "Percentage of cell area covered by concrete, asphalt, structures, and industrial roofing.",
    source: "GHSL Built-Up & OpenStreetMap"
  },
  elevation_m: {
    id: "elevation_m",
    label: "Topographic Elevation",
    shortLabel: "Elevation (m)",
    category: "explanatory",
    units: "m ASL",
    min: 400,
    max: 1300,
    gradient: "linear-gradient(90deg, #15803d, #eab308, #b45309, #78350f, #f1f5f9)",
    description: "Elevation above sea level. Highlights Western Ghats crests (Igatpuri/Trimbakeshwar) versus Eastern plains (Malegaon).",
    source: "Copernicus GLO-30 DEM"
  },
  pop_density_km2: {
    id: "pop_density_km2",
    label: "Population Density",
    shortLabel: "Population / km²",
    category: "explanatory",
    units: "people/km²",
    min: 50,
    max: 14000,
    gradient: "linear-gradient(90deg, #f8fafc, #fed7aa, #fb923c, #c026d3, #4a044e)",
    description: "Estimated resident population density per square kilometer.",
    source: "WorldPop / Census India Projections"
  }
};

/**
 * Returns an RGBA color string for a metric value based on its min/max range.
 */
export function getColorForValue(metricId, val) {
  if (val === undefined || val === null || isNaN(val)) {
    return "rgba(100, 116, 139, 0.4)";
  }

  const config = METRIC_CONFIGS[metricId] || METRIC_CONFIGS.lst_summer_mean;
  const min = config.min;
  const max = config.max;
  const norm = Math.max(0, Math.min(1, (val - min) / (max - min)));

  if (metricId.startsWith("lst_") || metricId === "thermal_anomaly") {
    // Thermal Ramp: Blue -> Cyan -> Green -> Yellow -> Orange -> Red -> Crimson
    if (norm < 0.15) return interpolateColor("#3b82f6", "#06b6d4", norm / 0.15);
    if (norm < 0.35) return interpolateColor("#06b6d4", "#10b981", (norm - 0.15) / 0.2);
    if (norm < 0.55) return interpolateColor("#10b981", "#eab308", (norm - 0.35) / 0.2);
    if (norm < 0.75) return interpolateColor("#eab308", "#ea580c", (norm - 0.55) / 0.2);
    if (norm < 0.90) return interpolateColor("#ea580c", "#dc2626", (norm - 0.75) / 0.15);
    return interpolateColor("#dc2626", "#7f1d1d", (norm - 0.90) / 0.10);
  }

  if (metricId === "air_temp_summer_c") {
    if (norm < 0.33) return interpolateColor("#38bdf8", "#818cf8", norm / 0.33);
    if (norm < 0.66) return interpolateColor("#818cf8", "#f472b6", (norm - 0.33) / 0.33);
    return interpolateColor("#f472b6", "#ea580c", (norm - 0.66) / 0.34);
  }

  if (metricId === "ndvi") {
    // Brown -> Olive -> Light Green -> Forest Green -> Dark Pine
    if (norm < 0.25) return interpolateColor("#78350f", "#ca8a04", norm / 0.25);
    if (norm < 0.55) return interpolateColor("#ca8a04", "#84cc16", (norm - 0.25) / 0.3);
    if (norm < 0.85) return interpolateColor("#84cc16", "#15803d", (norm - 0.55) / 0.3);
    return interpolateColor("#15803d", "#064e3b", (norm - 0.85) / 0.15);
  }

  if (metricId === "built_up_pct") {
    if (norm < 0.25) return interpolateColor("#94a3b8", "#cbd5e1", norm / 0.25);
    if (norm < 0.55) return interpolateColor("#cbd5e1", "#fb923c", (norm - 0.25) / 0.3);
    if (norm < 0.80) return interpolateColor("#fb923c", "#ea580c", (norm - 0.55) / 0.25);
    return interpolateColor("#ea580c", "#991b1b", (norm - 0.80) / 0.20);
  }

  if (metricId === "elevation_m") {
    if (norm < 0.3) return interpolateColor("#15803d", "#eab308", norm / 0.3);
    if (norm < 0.7) return interpolateColor("#eab308", "#b45309", (norm - 0.3) / 0.4);
    return interpolateColor("#b45309", "#f1f5f9", (norm - 0.7) / 0.3);
  }

  if (metricId === "pop_density_km2") {
    if (norm < 0.25) return interpolateColor("#f8fafc", "#fed7aa", norm / 0.25);
    if (norm < 0.55) return interpolateColor("#fed7aa", "#fb923c", (norm - 0.25) / 0.3);
    if (norm < 0.80) return interpolateColor("#fb923c", "#c026d3", (norm - 0.55) / 0.25);
    return interpolateColor("#c026d3", "#4a044e", (norm - 0.80) / 0.20);
  }

  return "#f97316";
}

function interpolateColor(color1, color2, factor) {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  const r = Math.round(c1.r + factor * (c2.r - c1.r));
  const g = Math.round(c1.g + factor * (c2.g - c1.g));
  const b = Math.round(c1.b + factor * (c2.b - c1.b));
  return `rgb(${r}, ${g}, ${b})`;
}

function hexToRgb(hex) {
  let c = hex.replace("#", "");
  if (c.length === 3) c = c.split("").map(x => x + x).join("");
  const num = parseInt(c, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}
