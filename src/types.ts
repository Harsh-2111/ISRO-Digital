/**
 * Shared Type Definitions for the ISRO Climate Digital Twin
 */

export interface ClimateMetrics {
  temperature: number; // °C
  rainfall: number; // mm
  humidity: number; // %
  climateRiskIndex: number; // 0-100
  heatwaveDays: number;
  heavyRainDays: number;
  droughtRisk: 'Low' | 'Moderate' | 'High' | 'Extreme';
  floodRisk: 'Low' | 'Moderate' | 'High' | 'Extreme';
  cycloneRisk: 'Low' | 'Moderate' | 'High' | 'Extreme';
  agricultureRisk: 'Low' | 'Moderate' | 'High' | 'Extreme';
  waterStress: 'Low' | 'Moderate' | 'High' | 'Extreme';
  urbanHeatIsland: 'Low' | 'Moderate' | 'High' | 'Extreme';
  lst: number; // Land Surface Temperature (°C)
  sst: number; // Sea Surface Temperature (°C)
}

export interface HistoricalDataPoint {
  year: number;
  temperature: number;
  rainfall: number;
  humidity: number;
  anomalyTemp: number; // deviation from baseline
  anomalyRain: number; // deviation from baseline
}

export interface ForecastDataPoint {
  year: number;
  temperature: number;
  rainfall: number;
  humidity: number;
  confidenceMin: number;
  confidenceMax: number;
}

export interface ModelMetrics {
  name: string; // e.g. Linear Regression, Random Forest, XGBoost, LightGBM, LSTM, GRU, Transformer
  rmse: number;
  mae: number;
  mape: number; // %
  r2: number; // R-squared
  isSelected: boolean;
}

export interface ScenarioInput {
  tempDelta: number; // -5 to +5 °C
  rainDelta: number; // -50% to +50%
  humidityDelta: number; // -30% to +30%
  co2Delta: number; // -100 to +400 ppm (baseline 420 ppm)
}

export interface ScenarioResult {
  temperature: number;
  rainfall: number;
  humidity: number;
  co2Level: number;
  floodProbability: number; // 0-100%
  droughtProbability: number; // 0-100%
  heatwaveDays: number;
  waterStressIndex: number; // 0-100
  cropYieldImpact: number; // % change
  riskAssessment: {
    heatwave: 'Low' | 'Moderate' | 'High' | 'Extreme';
    flood: 'Low' | 'Moderate' | 'High' | 'Extreme';
    drought: 'Low' | 'Moderate' | 'High' | 'Extreme';
    agriculture: 'Low' | 'Moderate' | 'High' | 'Extreme';
  };
}

export interface DistrictClimate {
  id: string;
  name: string;
  state: string;
  metrics: ClimateMetrics;
  historical: HistoricalDataPoint[];
  forecast: ForecastDataPoint[];
  models: ModelMetrics[];
}

export interface StateClimate {
  id: string;
  name: string;
  capital: string;
  lat: number;
  lng: number;
  averageTemp: number;
  totalRainfall: number;
  humidity: number;
  climateRiskIndex: number;
  districts: DistrictClimate[];
}

export interface ClimateAlert {
  id: string;
  title: string;
  severity: 'High' | 'Medium' | 'Low';
  state: string;
  validUntil: string;
  description: string;
  type: 'Heatwave' | 'Flood' | 'Cyclone' | 'Drought' | 'Heavy Rainfall';
}

export interface AdminLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  status: 'Success' | 'Warning' | 'Error';
  details: string;
}

export interface DatasetUpload {
  id: string;
  fileName: string;
  fileSize: string;
  source: 'MOSDAC' | 'IMD' | 'INSAT Satellite' | 'Ground Station';
  uploadedBy: string;
  uploadedAt: string;
  recordsCount: number;
  parameter: string;
}
