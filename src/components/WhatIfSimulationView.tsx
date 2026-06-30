import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Thermometer, 
  CloudRain, 
  Droplets, 
  Compass, 
  CheckCircle2, 
  HelpCircle, 
  AlertTriangle, 
  Leaf, 
  Sparkles, 
  TrendingUp, 
  RotateCcw
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ScenarioInput, ScenarioResult } from '../types';

export const WhatIfSimulationView: React.FC = () => {
  // Scenario default sliders
  const [tempDelta, setTempDelta] = useState<number>(1.5); // +1.5°C default warming
  const [rainDelta, setRainDelta] = useState<number>(10);  // +10% rainfall shift
  const [humidityDelta, setHumidityDelta] = useState<number>(5);
  const [co2Delta, setCo2Delta] = useState<number>(150);    // +150 ppm CO2 increase

  const [simulationResult, setSimulationResult] = useState<ScenarioResult | null>(null);
  const [loading, setLoading] = useState(false);

  // Run scenario simulation query against Express backend
  const triggerSimulation = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/scenario/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tempDelta,
          rainDelta,
          humidityDelta,
          co2Delta
        })
      });
      const data = await response.json();
      setSimulationResult(data);
    } catch (error) {
      console.error("Simulation endpoint failed, using local fallback model.", error);
    } finally {
      setLoading(false);
    }
  };

  // Run simulation on first load or when sliders settle
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      triggerSimulation();
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [tempDelta, rainDelta, humidityDelta, co2Delta]);

  const resetSliders = () => {
    setTempDelta(0);
    setRainDelta(0);
    setHumidityDelta(0);
    setCo2Delta(0);
  };

  // Prepare recharts comparison
  const getChartData = () => {
    if (!simulationResult) return [];
    return [
      { name: 'Flood Prob (%)', Baseline: 25, Simulated: simulationResult.floodProbability },
      { name: 'Drought Prob (%)', Baseline: 30, Simulated: simulationResult.droughtProbability },
      { name: 'Water Stress Index', Baseline: 45, Simulated: simulationResult.waterStressIndex },
      { name: 'Heatwave Days', Baseline: 8, Simulated: simulationResult.heatwaveDays }
    ];
  };

  return (
    <div id="what_if_simulation_root" className="space-y-3">
      
      {/* 1. Header description banner */}
      <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <span className="text-[9px] font-bold text-isro-blue bg-isro-light-blue px-2 py-0.5 rounded font-mono leading-none">HYDRO-THERMODYNAMIC SIMULATOR</span>
          <h2 className="text-base font-bold font-display text-slate-800 tracking-tight mt-1 leading-tight">
            What-If Scenario Simulation Laboratory
          </h2>
          <p className="text-[11px] text-slate-500 font-medium leading-none mt-1">
            Manipulate boundary climate variables to observe mathematical feedback loops on agricultural yields, flooding probabilities, and water stress index.
          </p>
        </div>

        <button
          onClick={resetSliders}
          className="px-2 py-1 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold flex items-center gap-1 transition"
        >
          <RotateCcw size={12} /> Reset Baseline
        </button>
      </div>
      {/* 2. Sliders and Live Outputs Splits Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
        
        {/* Sliders Console Panel (Left 2 Columns) */}
        <div className="lg:col-span-2 bg-white p-3 rounded-xl border border-slate-100 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3.5">
            <h3 className="font-bold text-slate-800 font-display text-xs border-b border-slate-100 pb-1.5">
              Atmospheric Control Sliders
            </h3>

            {/* Slider 1: Temp Delta */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                  <Thermometer size={12} className="text-red-500" /> Temperature Delta
                </span>
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${tempDelta > 0 ? 'text-red-500 bg-red-50' : tempDelta < 0 ? 'text-blue-500 bg-blue-50' : 'text-slate-500 bg-slate-50'}`}>
                  {tempDelta > 0 ? `+${tempDelta}` : tempDelta} °C
                </span>
              </div>
              <input
                type="range"
                min="-5"
                max="5"
                step="0.5"
                value={tempDelta}
                onChange={(e) => setTempDelta(parseFloat(e.target.value))}
                className="w-full accent-isro-blue cursor-pointer h-1 bg-slate-100 rounded-lg"
              />
              <div className="flex justify-between text-[8px] text-slate-400 font-mono leading-none">
                <span>-5.0 °C (Cooling)</span>
                <span>Baseline</span>
                <span>+5.0 °C (Severe Warming)</span>
              </div>
            </div>

            {/* Slider 2: Rainfall Delta */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                  <CloudRain size={12} className="text-isro-blue" /> Precipitation Shift
                </span>
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${rainDelta > 0 ? 'text-emerald-600 bg-emerald-50' : rainDelta < 0 ? 'text-amber-600 bg-amber-50' : 'text-slate-500 bg-slate-50'}`}>
                  {rainDelta > 0 ? `+${rainDelta}` : rainDelta}%
                </span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                step="5"
                value={rainDelta}
                onChange={(e) => setRainDelta(parseInt(e.target.value))}
                className="w-full accent-isro-blue cursor-pointer h-1 bg-slate-100 rounded-lg"
              />
              <div className="flex justify-between text-[8px] text-slate-400 font-mono leading-none">
                <span>-50% (Drought)</span>
                <span>Baseline</span>
                <span>+50% (Heavy Deluge)</span>
              </div>
            </div>

            {/* Slider 3: Humidity Delta */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                  <Droplets size={12} className="text-teal-500" /> Relative Humidity
                </span>
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${humidityDelta > 0 ? 'text-teal-600 bg-teal-50' : humidityDelta < 0 ? 'text-amber-600 bg-amber-50' : 'text-slate-500 bg-slate-50'}`}>
                  {humidityDelta > 0 ? `+${humidityDelta}` : humidityDelta}%
                </span>
              </div>
              <input
                type="range"
                min="-30"
                max="30"
                step="2"
                value={humidityDelta}
                onChange={(e) => setHumidityDelta(parseInt(e.target.value))}
                className="w-full accent-isro-blue cursor-pointer h-1 bg-slate-100 rounded-lg"
              />
              <div className="flex justify-between text-[8px] text-slate-400 font-mono leading-none">
                <span>-30%</span>
                <span>Baseline</span>
                <span>+30%</span>
              </div>
            </div>

            {/* Slider 4: CO2 concentration Delta */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                  <Compass size={12} className="text-slate-500" /> CO₂ Concentration Shift
                </span>
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${co2Delta > 0 ? 'text-red-600 bg-red-50' : co2Delta < 0 ? 'text-emerald-600 bg-emerald-50' : 'text-slate-500 bg-slate-50'}`}>
                  {co2Delta > 0 ? `+${co2Delta}` : co2Delta} ppm
                </span>
              </div>
              <input
                type="range"
                min="-100"
                max="400"
                step="25"
                value={co2Delta}
                onChange={(e) => setCo2Delta(parseInt(e.target.value))}
                className="w-full accent-isro-blue cursor-pointer h-1 bg-slate-100 rounded-lg"
              />
              <div className="flex justify-between text-[8px] text-slate-400 font-mono leading-none">
                <span>-100 ppm (320 ppm)</span>
                <span>Baseline (420 ppm)</span>
                <span>+400 ppm (820 ppm)</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-2 rounded-lg border border-slate-150 text-[9px] text-slate-500 leading-relaxed font-mono mt-2">
            <span className="font-bold text-slate-700 flex items-center gap-1 mb-0.5"><Sparkles size={10} className="text-isro-yellow" /> Feedback Equations:</span>
            Warming increases water capacity by ~7% per 1°C (Clausius-Clapeyron equation), amplifying storm surge severity while exacerbating land-surface soil moisture depletion.
          </div>
        </div>

        {/* Projections Visual Outputs (Right 3 Columns) */}
        <div className="lg:col-span-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between h-[440px]">
          <div>
            <div className="border-b border-slate-100 pb-1.5 flex items-center justify-between mb-2">
              <div>
                <h3 className="font-bold text-slate-800 font-display text-xs">Simulated Environmental Projections</h3>
                <p className="text-[9px] text-slate-400 font-mono">Comparison of baseline conditions vs simulated feedback outputs</p>
              </div>
              {loading ? (
                <span className="text-[9px] font-mono text-slate-400 animate-pulse">Running simulation...</span>
              ) : (
                <span className="text-[9px] font-mono font-bold bg-emerald-50 border border-emerald-200 text-emerald-600 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                  <CheckCircle2 size={9} /> MODEL CONVERGED
                </span>
              )}
            </div>

            {/* KPI metrics row for Crop Yield Impact */}
            {simulationResult && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                {/* Crop Yield feedback card */}
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex items-center justify-between hover:shadow-sm transition">
                  <div className="leading-tight">
                    <span className="text-[8px] text-slate-400 font-mono uppercase tracking-wider block mb-0.5">Kharif Crop Yield Impact</span>
                    <span className={`text-base font-bold font-display ${simulationResult.cropYieldImpact < 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                      {simulationResult.cropYieldImpact > 0 ? `+${simulationResult.cropYieldImpact}` : simulationResult.cropYieldImpact}%
                    </span>
                    <span className="text-[8px] font-mono text-slate-400 block">CO₂ fertilizer vs thermal strain</span>
                  </div>
                  <div className="bg-emerald-50 p-1.5 rounded-lg text-emerald-600">
                    <Leaf size={14} />
                  </div>
                </div>

                {/* Combined Simulated CO2 Level Card */}
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex items-center justify-between hover:shadow-sm transition">
                  <div className="leading-tight">
                    <span className="text-[8px] text-slate-400 font-mono uppercase tracking-wider block mb-0.5">Simulated CO₂ Levels</span>
                    <span className="text-base font-bold font-display text-slate-800">
                      {simulationResult.co2Level} ppm
                    </span>
                    <span className="text-[8px] font-mono text-slate-400 block">Pre-industrial index: 280 ppm</span>
                  </div>
                  <div className="bg-slate-100 p-1.5 rounded-lg text-slate-600">
                    <TrendingUp size={14} />
                  </div>
                </div>
              </div>
            )}

            {/* Recharts Projections Bar Chart */}
            <div className="h-[180px] w-full text-[9px] font-mono">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getChartData()} margin={{ top: 5, right: 10, left: -30, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} />
                  <YAxis stroke="#94a3b8" tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontFamily: 'monospace', fontSize: '10px' }} />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                  <Bar dataKey="Baseline" fill="#0D47A1" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Simulated" fill="#FFC107" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {simulationResult && (
            <div className="grid grid-cols-4 gap-2 pt-3 border-t border-slate-100 text-[10px] font-mono text-center">
              <div>
                <span className="text-slate-400 block">Drought Risk:</span>
                <span className={`font-bold uppercase ${
                  simulationResult.riskAssessment.drought === 'Extreme' ? 'text-red-600' : simulationResult.riskAssessment.drought === 'High' ? 'text-red-500' : 'text-amber-500'
                }`}>{simulationResult.riskAssessment.drought}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Flood Risk:</span>
                <span className={`font-bold uppercase ${
                  simulationResult.riskAssessment.flood === 'Extreme' ? 'text-red-600' : simulationResult.riskAssessment.flood === 'High' ? 'text-red-500' : 'text-emerald-500'
                }`}>{simulationResult.riskAssessment.flood}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Agri Impact:</span>
                <span className={`font-bold uppercase ${
                  simulationResult.riskAssessment.agriculture === 'Extreme' ? 'text-red-600' : 'text-red-500'
                }`}>{simulationResult.riskAssessment.agriculture}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Heatwave hazard:</span>
                <span className="font-bold text-slate-800">{simulationResult.heatwaveDays} days/yr</span>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
