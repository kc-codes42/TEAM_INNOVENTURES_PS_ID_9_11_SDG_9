from app.schemas.region import RegionRequest
from app.services.geo import geometry_from_region
from app.services.data_loader import load_all_region_data
from app.services.features import build_feature_vector
from app.services.ml import risk_model
from app.services.simulation import simulate_scenarios

# 1. Define region
region = RegionRequest(region_id="region_1")

# 2. Geospatial preprocessing
geo_data = geometry_from_region(region)

# 3. Load mock data
raw_data = load_all_region_data("region_1")

# 4. Feature engineering
features = build_feature_vector(raw_data, geo_data)

# 5. ML prediction
risk = risk_model.predict(features)

# 6. Scenario simulation
scenarios = simulate_scenarios(
    base_features=features,
    base_risk_score=risk["risk_score"]
)

print("BASE RISK")
print(risk)

print("\nSCENARIOS")
for s in scenarios:
    print(s)
