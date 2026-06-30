import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Cpu, 
  Settings, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  BarChart4, 
  Play,
  RotateCcw
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area } from 'recharts';
import { StateClimate, DistrictClimate, ModelMetrics } from '../types';

interface AIPredictionsViewProps {
  states: StateClimate[];
  selectedState: StateClimate | null;
  selectedDistrict: DistrictClimate | null;
}

export const AIPredictionsView: React.FC<AIPredictionsViewProps> = ({
  states,
  selectedState,
  selectedDistrict
}) => {
  const [selectedModel, setSelectedModel] = useState<string>('XGBoost');
  const [retraining, setRetraining] = useState(false);
  const [retrainProgress, setRetrainProgress] = useState(0);
  const [trainingLogs, setTrainingLogs] = useState<string[]>([]);
  const [trainingDone, setTrainingDone] = useState(false);

  // Active district fallback
  const districtName = selectedDistrict 
    ? selectedDistrict.name 
    : states[1].districts[0].name;

  const districtObj = selectedDistrict 
    ? selectedDistrict 
    : states[1].districts[0];

  // Model comparison parameters
  const modelsData: ModelMetrics[] = districtObj.models;

  // Compile data for RMSE & MAE charts
  const comparisonData = modelsData.map(m => ({
    name: m.name,
    RMSE: m.rmse,
    MAE: m.mae,
    MAPE: m.mape,
    R2: m.r2 * 100 // format as percentage for visual balance
  }));

  // Forecast visualization data with bounds
  const forecastData = districtObj.forecast.map((f: any) => ({
    year: f.year,
    Value: f.temperature,
    ConfidenceUpper: f.confidenceMax,
    ConfidenceLower: f.confidenceMin
  }));

  // Run simulated model retraining sequence
  const startRetraining = () => {
    setRetraining(true);
    setTrainingDone(false);
    setRetrainProgress(10);
    setTrainingLogs(["[INFO] Initializing ISRO Climatology Retraining Workbench...", "[INFO] Loading INSAT-3D gridded land-surface dataset..."]);

    const interval = setInterval(() => {
      setRetrainProgress(prev => {
        const next = prev + 15;
        if (next >= 100) {
          clearInterval(interval);
          setTrainingLogs(logs => [
            ...logs,
            `[CUDA] Hyperparameters loaded. Epochs: 250. Optimizer: AdamW.`,
            `[EPOCH 100] training_loss: 0.012 - validation_loss: 0.014`,
            `[EPOCH 250] training_loss: 0.003 - validation_loss: 0.0035`,
            `[INFO] Target convergence criteria met. Saving weights to storage.`,
            `[SUCCESS] Model training concluded. XGBoost accuracy bounds updated.`
          ]);
          setRetraining(false);
          setTrainingDone(true);
          return 100;
        }

        // Add progressive log entries
        if (next === 25) {
          setTrainingLogs(logs => [...logs, "[INFO] Pre-processing data array. Standardizing columns: LST, SST, Rain...", "[INFO] Grid block resolution: 0.25 x 0.25 degree."]);
        }
        if (next === 55) {
          setTrainingLogs(logs => [...logs, "[INFO] Constructing ensemble tree architectures...", "[XGBOOST] Instantiating booster depth: 8, learning_rate: 0.05..."]);
        }
        if (next === 85) {
          setTrainingLogs(logs => [...logs, "[INFO] Cross-validation sequence active. Folds: 5...", "[METRICS] Evaluating intermediate testing metrics..."]);
        }

        return next;
      });
    }, 500);
  };

  return (
    <div id="ai_predictions_view_root" className="space-y-3">
      
      {/* 1. Header banner */}
      <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <span className="text-[9px] font-bold text-isro-blue bg-isro-light-blue px-2 py-0.5 rounded font-mono leading-none">NEURAL SCIENCE LABORATORY</span>
          <h2 className="text-base font-bold font-display text-slate-800 tracking-tight mt-1 leading-none">
            ISRO Climatology Predictive Model Workbench
          </h2>
          <p className="text-[11px] text-slate-500 font-medium mt-1 leading-tight">
            Deploy and compare advanced machine learning boundaries to project India's long-term climate indicators.
          </p>
        </div>
        
        {/* Active model label */}
        <div className="bg-isro-yellow/15 border border-isro-yellow/40 p-1.5 rounded-lg flex items-center gap-1.5 shrink-0">
          <Cpu size={14} className="text-amber-500" />
          <div className="leading-tight">
            <span className="text-[8px] text-slate-500 font-mono block">BEST ACCURACY MODEL</span>
            <span className="text-[10px] font-bold text-slate-800">XGBoost (Auto-selected)</span>
          </div>
        </div>
      </div>

      {/* 2. Top Model Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Model Selection table (Left Column) */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
          <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 font-display text-xs">Model Comparer</h3>
            <span className="text-[9px] font-mono text-slate-400">Target: {districtName}</span>
          </div>

          <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
            {modelsData.map((m) => {
              const isSelected = selectedModel === m.name;
              return (
                <button
                  key={m.name}
                  onClick={() => setSelectedModel(m.name)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-isro-blue border-isro-blue text-white font-semibold shadow-sm glow-blue'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div>
                    <span className="block font-semibold">{m.name}</span>
                    <span className={`text-[8px] font-mono ${isSelected ? 'text-isro-yellow' : 'text-slate-400'}`}>
                      RMSE: {m.rmse} | R²: {m.r2}
                    </span>
                  </div>
                  {m.isSelected && (
                    <span className="text-[8px] font-mono font-bold bg-isro-yellow text-slate-950 px-1.5 py-0.2 rounded">
                      BEST
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Model Error Comparison charts (Right 2 columns) */}
        <div className="md:col-span-2 bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between h-[210px]">
          <div>
            <div className="border-b border-slate-100 pb-1 flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-800 font-display text-xs">Model Evaluation Error Margins (RMSE vs MAE)</h3>
              <span className="text-[8px] font-mono text-slate-400">Lower is better</span>
            </div>

            <div className="h-[125px] w-full text-[9px] font-mono">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 5, right: 10, left: -30, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} />
                  <YAxis stroke="#94a3b8" tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontFamily: 'monospace', fontSize: '9px' }} />
                  <Legend wrapperStyle={{ fontSize: '9px' }} />
                  <Bar dataKey="RMSE" fill="#0D47A1" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="MAE" fill="#FFC107" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="text-[9px] text-slate-400 font-mono text-center pt-1 border-t border-slate-100 leading-none">
            RMSE: Root Mean Square Error | MAE: Mean Absolute Error. Volatility index adjusted on rainfall parameters.
          </div>
        </div>
      </div>

      {/* 3. Advanced Confidence Interval Timeline Chart & Retraining Console */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
        
        {/* Prediction Confidence Intervals (Left 3 columns) */}
        <div className="lg:col-span-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between h-[230px]">
          <div>
            <div className="border-b border-slate-100 pb-1.5 flex items-center justify-between mb-2">
              <div>
                <h3 className="font-bold text-slate-800 font-display text-xs">Long-term Predictive Confidence Interval (15 Years)</h3>
                <p className="text-[9px] text-slate-400 font-mono">Confidence boundary mapping under {selectedModel}</p>
              </div>
              <span className="text-[8px] bg-slate-100 px-1.5 py-0.2 rounded font-bold text-slate-600 font-mono">MODEL: {selectedModel}</span>
            </div>

            <div className="h-[145px] w-full text-[9px] font-mono">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastData} margin={{ top: 5, right: 10, left: -30, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="year" stroke="#94a3b8" tickLine={false} />
                  <YAxis stroke="#94a3b8" tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontFamily: 'monospace', fontSize: '9px' }} />
                  <Area type="monotone" dataKey="ConfidenceUpper" stroke="none" fill="rgba(13, 71, 161, 0.08)" />
                  <Area type="monotone" dataKey="Value" stroke="#0D47A1" strokeWidth={2} fill="rgba(13, 71, 161, 0.15)" />
                  <Area type="monotone" dataKey="ConfidenceLower" stroke="none" fill="none" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <p className="text-[9px] text-slate-400 font-mono text-center leading-none mt-1">
             Shaded bounding box represents 95% predictive confidence intervals under multi-variable convergence matrices.
          </p>
        </div>
        {/* Retraining Console (Right 2 columns) */}
        <div className="lg:col-span-2 bg-slate-900 text-slate-100 p-3 rounded-xl shadow-lg border border-slate-800 flex flex-col justify-between h-[230px] font-mono">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
              <span className="text-[10px] font-bold text-isro-yellow flex items-center gap-1 uppercase">
                <Settings size={12} className={retraining ? "animate-spin" : ""} /> RETRAIN MODEL CONSOLE
              </span>
              <span className="text-[8px] text-slate-500 font-mono">GPU_CORE_0</span>
            </div>

            <div className="space-y-1 h-[105px] overflow-y-auto text-[9px] leading-relaxed pr-1 scrollbar-thin text-emerald-400 bg-slate-950/80 p-2 rounded-lg border border-slate-800">
              {trainingLogs.length > 0 ? (
                trainingLogs.map((log, idx) => (
                  <p key={idx} className={log.includes('[SUCCESS]') ? 'text-isro-yellow font-bold' : log.includes('[ERROR]') ? 'text-red-400' : 'text-emerald-400'}>
                    {log}
                  </p>
                ))
              ) : (
                <div className="text-slate-500 h-full flex flex-col items-center justify-center text-center">
                  <Play size={16} className="mb-1 text-slate-600" />
                  <p>Console Idle.</p>
                  <p className="text-[8px] max-w-[140px] mt-0.5 leading-tight">Click "Initiate Model Retuning" to align tree structures on modern grids.</p>
                </div>
              )}
            </div>
          </div>

          {retraining && (
            <div className="mt-1 shrink-0">
              <div className="flex justify-between text-[8px] text-slate-400 mb-0.5">
                <span>TUNING NEURAL NODES</span>
                <span>{retrainProgress}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                <div className="bg-isro-yellow h-full transition-all duration-300" style={{ width: `${retrainProgress}%` }}></div>
              </div>
            </div>
          )}

          <div className="mt-2 pt-2 border-t border-slate-800 flex items-center gap-1.5 shrink-0">
            <button
              onClick={startRetraining}
              disabled={retraining}
              className="w-full bg-isro-yellow text-slate-950 font-bold py-1.5 px-2 rounded-lg text-[9px] flex items-center justify-center gap-1 hover:bg-amber-400 transition disabled:opacity-50 cursor-pointer uppercase"
            >
              <Cpu size={10} /> Initiate Model Retuning
            </button>
            {trainingDone && (
              <span className="text-[8px] text-emerald-400 font-bold bg-emerald-950/50 border border-emerald-900/50 px-1.5 py-1.5 rounded-lg shrink-0 flex items-center gap-0.5">
                <CheckCircle2 size={9} /> SYNCED
              </span>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
