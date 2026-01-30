# Team Innoventures

## Project Title
Digital Twin for Rural Broadband Resilience

## SDG Alignment
**SDG 9 – Industry, Innovation and Infrastructure**  
**Target 9.1 / 9.11:** Develop reliable, sustainable, and resilient infrastructure using digital and data-driven technologies.

---

## System Objective
Predict rural broadband failure risk and recommend resilient network planning using satellite, terrain, weather, and population data.  
The system is fully software-based, zero-cost, and uses only open datasets and free-tier tools.

---

## Problem Statement
Rural broadband infrastructure planning suffers from lack of ground surveys, delayed failure detection, and reactive decision-making.  
Terrain, weather volatility, and sparse population data are rarely combined into a single analytical system, resulting in fragile connectivity and inefficient investments.

---

## Proposed Solution
We built a **digital twin–based decision platform** that models rural connectivity conditions using satellite data and machine learning.  
The platform predicts failure risk, highlights vulnerable regions, and recommends optimized relay or hybrid network planning—without physical deployment or paid APIs.

---

## System Architecture
**Data Ingestion → Geospatial Processing → ML Risk Prediction → Optimization → Visualization**

---

## Data Sources (Open & Free)
- **NASA SRTM / Copernicus DEM** – Terrain and elevation modeling
- **WorldPop** – Population density prioritization
- **NOAA Open Weather Data** – Weather volatility and signal stress
- **OpenCellID (sample/free data)** – Simulated cellular coverage patterns

---

## Data Processing & Geospatial Layer
- **Python** – Core data and ML pipeline
- **GeoPandas** – Spatial joins and regional aggregation
- **Rasterio** – Satellite raster processing
- **Shapely** – Distance, obstruction, and geometry analysis

---

## Machine Learning Layer
- **Scikit-learn**
  - Random Forest (baseline, interpretable)
  - Gradient Boosting (higher accuracy)

### Engineered Features
- Terrain elevation variance
- Distance from nearest tower
- Weather volatility index
- Population density
- Simulated historical outage likelihood

### Outputs
- **Connectivity Risk Score (0–100)**
- **Binary Classification:** Stable / At-risk

---

## Optimization & Recommendation Engine
- **NumPy + SciPy**
- Identifies high-risk zones
- Simulates relay or tower placement
- Minimizes:
  - Coverage gaps
  - Cost proxy (distance + terrain difficulty)

### Outputs
- Suggested relay locations
- Backup routing paths
- Satellite–terrestrial hybrid flags

---

## Backend
- **FastAPI**
- Handles:
  - Data pipeline orchestration
  - ML inference APIs
  - Scenario simulation endpoints

---

## Frontend & Visualization
- **Next.js** – Dashboard and UI
- **Leaflet.js** – Interactive maps (no API keys)
- **Chart.js** – Risk trends and analytics

---

## Deployment (Zero Cost)
- **Frontend:** Vercel (free tier)
- **Backend:** Render / Railway (free tier)
- **Storage:** Local CSV / JSON  
  Optional: Supabase free tier for persistence

---

## Demo Capabilities
1. Rural map with broadband risk heatmap
2. Village-level risk score and failure explanation
3. Weather stress simulation
4. Relay placement toggle with risk reduction
5. Infrastructure planning comparison view

---

## Why This Works in a Hackathon
- No hardware assumptions
- No paid APIs or licenses
- Uses real satellite and demographic data
- ML is explainable and defensible
- Visually strong and technically credible
- Direct SDG 9.11 relevance

---

## Team Innoventures
- **Athar Shaikh**
- **Sujal Belkhode**
- **Kaustubh Cahuhan**
- **Kaifoddin Kazi**

---

## License
MIT License
