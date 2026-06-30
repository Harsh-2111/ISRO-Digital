import React from 'react';
import { StateClimate, DistrictClimate } from '../types';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Calendar, TrendingUp, Info, ArrowUpRight, BarChart3 } from 'lucide-react';

interface ClimateOverviewViewProps {
  states: StateClimate[];
  selectedState: StateClimate | null;
  selectedDistrict: DistrictClimate | null;
}

export const ClimateOverviewView: React.FC<ClimateOverviewViewProps> = ({
  states,
  selectedState,
  selectedDistrict
}) => {
  const districtObj = selectedDistrict 
    ? selectedDistrict 
    : states[1].districts[0];

  const locationLabel = selectedDistrict 
    ? `${selectedDistrict.name} (${selectedState?.name})` 
    : states[1].name;

  // Historical data formatted for Recharts
  const historicalData = districtObj.historical.map(h => ({
    year: h.year,
    Temperature: h.temperature,
    Rainfall: h.rainfall,
    TempAnomaly: h.anomalyTemp,
    RainAnomaly: h.anomalyRain
  }));

  // Mock seasonal distribution
  const seasonalData = [
    { season: 'Winter (JF)', AvgTemp: 18.2, Rainfall: 45 },
    { season: 'Pre-Monsoon (MAM)', AvgTemp: 31.4, Rainfall: 120 },
    { season: 'Monsoon (JJAS)', AvgTemp: 27.5, Rainfall: 850 },
    { season: 'Post-Monsoon (OND)', AvgTemp: 22.8, Rainfall: 171 }
  ];

  return (
    <div id="climate_overview_view_root" className="space-y-6">
      
      {/* Header card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-1.5 mb-1">
          <TrendingUp size={16} className="text-isro-blue" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Statistical Observation Ledger</span>
        </div>
        <h2 className="text-xl font-bold font-display text-slate-800 tracking-tight">
          Historical Climate Overview: {locationLabel}
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Study climatology anomalies, warming profiles, and seasonal precipitation shifts across the last 25 years.
        </p>
      </div>

      {/* Grid containing historical charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Temperature Anomalies (Line/Area Chart) */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-[360px]">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-4">
              <div>
                <h3 className="font-bold text-slate-800 font-display text-xs">Temperature Anomaly Timeline (°C)</h3>
                <p className="text-[10px] text-slate-400 font-mono">Warming deviation compared to 20-year baseline average</p>
              </div>
              <span className="text-[10px] text-red-500 font-mono font-bold flex items-center gap-0.5">
                <ArrowUpRight size={12} /> warming trend +0.035°C/yr
              </span>
            </div>

            <div className="h-[240px] w-full text-xs font-mono">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historicalData} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="year" stroke="#94a3b8" tickLine={false} />
                  <YAxis stroke="#94a3b8" tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontFamily: 'monospace' }} />
                  <Area type="monotone" dataKey="TempAnomaly" stroke="#0D47A1" strokeWidth={2.5} fill="rgba(13, 71, 161, 0.15)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <p className="text-[9px] text-slate-400 font-mono text-center">
             Anomalies signify direct thermodynamic feedback loops in rural topsoil boundaries.
          </p>
        </div>

        {/* Precipitation Shifts (Bar Chart) */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-[360px]">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-4">
              <div>
                <h3 className="font-bold text-slate-800 font-display text-xs">Annual Precipitation Volume (mm)</h3>
                <p className="text-[10px] text-slate-400 font-mono">Precipitation volumes recorded under IMD gridded telemetry</p>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Baseline: {districtObj.metrics.rainfall} mm</span>
            </div>

            <div className="h-[240px] w-full text-xs font-mono">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={historicalData} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="year" stroke="#94a3b8" tickLine={false} />
                  <YAxis stroke="#94a3b8" tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontFamily: 'monospace' }} />
                  <Bar dataKey="Rainfall" fill="#0D47A1" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <p className="text-[9px] text-slate-400 font-mono text-center">
             Highly volatile bars indicate shifting patterns toward short-duration extreme downpours.
          </p>
        </div>
      </div>

      {/* Seasonal Profile */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="font-bold text-slate-800 font-display text-sm mb-4 flex items-center gap-2">
          <Calendar size={16} className="text-isro-blue" /> Seasonal Climatology Matrix (Averages)
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {seasonalData.map((item, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-center space-y-1">
              <span className="text-xs font-bold text-slate-700 block">{item.season}</span>
              <span className="text-xl font-bold font-display text-slate-800 block">{item.AvgTemp}°C</span>
              <span className="text-xs font-mono text-slate-400 block">Precipitation: {item.Rainfall} mm</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
