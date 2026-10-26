"""
Download & Ingestion Guide for Primary Remote Sensing and Meteorological Sources.
Provides verifiable code and steps for:
1. Google Earth Engine Landsat Collection 2 Level-2 Surface Temperature
2. Planetary Computer Sentinel-2 L2A STAC API
3. India Meteorological Department (IMD Pune) Daily 0.25° Gridded Data
"""

import sys

GEE_SCRIPT = '''
// Google Earth Engine JavaScript API Script for Landsat Surface Temperature
// Copy and run in https://code.earthengine.google.com/

var districtBoundary = ee.FeatureCollection("projects/your-project/assets/nashik_district_boundary");

// Function to scale and mask Landsat 8/9 Collection 2 Level 2
function applyLandsatCalibration(image) {
  // Optical bands scale: 0.0000275 + -0.2
  var optical = image.select('SR_B.').multiply(0.0000275).add(-0.2);
  
  // Thermal Surface Temperature (ST_B10) scale: 0.00341802 + 149.0 (Kelvin)
  // Convert Kelvin to Celsius: K - 273.15
  var thermal = image.select('ST_B10').multiply(0.00341802).add(149.0).subtract(273.15).rename('LST_Celsius');
  
  // QA_PIXEL bitmask: Bit 3 = Cloud, Bit 4 = Cloud Shadow, Bit 1 = Dilated Cloud
  var qa = image.select('QA_PIXEL');
  var cloudShadowMask = qa.bitwiseAnd(1 << 4).eq(0);
  var cloudMask = qa.bitwiseAnd(1 << 3).eq(0);
  var dilatedCloudMask = qa.bitwiseAnd(1 << 1).eq(0);
  var clearMask = cloudMask.and(cloudShadowMask).and(dilatedCloudMask);
  
  return image.addBands(optical, null, true)
              .addBands(thermal)
              .updateMask(clearMask);
}

// Filter for Nashik District during peak summer
var landsatSummer = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
  .merge(ee.ImageCollection('LANDSAT/LC09/C02/T1_L2'))
  .filterBounds(districtBoundary)
  .filterDate('2024-03-01', '2024-05-31')
  .map(applyLandsatCalibration);

var meanSummerLST = landsatSummer.select('LST_Celsius').mean().clip(districtBoundary);

Map.centerObject(districtBoundary, 9);
Map.addLayer(meanSummerLST, {min: 30, max: 50, palette: ['blue', 'cyan', 'green', 'yellow', 'orange', 'red']}, 'Nashik LST Summer 2024');
'''

def print_setup_instructions():
    print("=" * 70)
    print("URBAN HEAT MAPPER — NASHIK DISTRICT: DATA COLLECTION SETUP GUIDE")
    print("=" * 70)
    print("\n1. GOOGLE EARTH ENGINE (Landsat Collection 2 Level-2 Surface Temperature):")
    print("   - Requirement: Google Cloud Project with Earth Engine enabled (Free for Research/Non-Commercial).")
    print("   - Authentication: Run `earthengine authenticate` or use Python `ee.Initialize()` with a Service Account.")
    print("   - Scale & Offset: Land Surface Temperature (ST_B10) scale = 0.00341802, offset = 149.0 K.")
    print("   - Kelvin to Celsius: Temp_C = (DN * 0.00341802 + 149.0) - 273.15")
    print("   - Quality Flags: Use QA_PIXEL bitmask to remove clouds (bit 3), cloud shadows (bit 4), and cirrus (bit 2).")
    print("\n2. INDIA METEOROLOGICAL DEPARTMENT (IMDWeb Gridded Climate Data):")
    print("   - Website: https://www.imdpune.gov.in/cmpg/Griddata/Griddata.html")
    print("   - Requirement: User Registration at IMD Pune National Climate Centre.")
    print("   - Grid Format: Binary .GRD or NetCDF (.nc4) at 0.25° x 0.25° spatial resolution (~27 km).")
    print("   - Critical Reminder: IMD records ambient shaded air temperature at 1.5m height.")
    print("     It must NOT be confused with satellite radiometric skin temperature (LST).")
    print("\n3. SENTINEL-2 & GHSL (Planetary Computer STAC API):")
    print("   - Endpoint: https://planetarycomputer.microsoft.com/api/stac/v1")
    print("   - Python library: `pystac_client.Client.open(...)`")
    print("   - Free access without API token for general search and tile retrieval.")
    print("=" * 70)

if __name__ == "__main__":
    print_setup_instructions()
