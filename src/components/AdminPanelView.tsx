import React, { useState, useEffect } from 'react';
import { Database, Upload, RefreshCw, Terminal, CheckCircle2, AlertTriangle, Sparkles, Plus } from 'lucide-react';
import { AdminLog, DatasetUpload } from '../types';

export const AdminPanelView: React.FC = () => {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [datasets, setDatasets] = useState<DatasetUpload[]>([]);
  const [retraining, setRetraining] = useState(false);
  const [fileName, setFileName] = useState('');
  const [source, setSource] = useState<'MOSDAC' | 'IMD' | 'INSAT Satellite' | 'Ground Station'>('INSAT Satellite');
  const [parameter, setParameter] = useState('Land Surface Temp (LST)');
  const [uploading, setUploading] = useState(false);

  // Fetch initial logs & datasets from backend Express API
  const fetchAdminData = async () => {
    try {
      const logsRes = await fetch('/api/admin/logs');
      const logsData = await logsRes.json();
      setLogs(logsData);

      const dsRes = await fetch('/api/admin/datasets');
      const dsData = await dsRes.json();
      setDatasets(dsData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Handle custom file upload trigger
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim()) return;

    setUploading(true);
    try {
      const response = await fetch('/api/admin/dataset-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName,
          source,
          parameter,
          recordsCount: Math.round(500000 + Math.random() * 2000000),
          uploadedBy: "Dr. K. Sivan (Admin)"
        })
      });

      if (response.ok) {
        setFileName('');
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  // Trigger retraining cycle
  const handleRetrain = async () => {
    setRetraining(true);
    try {
      const response = await fetch('/api/admin/retrain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelName: "XGBoost",
          datasetId: datasets[0]?.id || "ds-01"
        })
      });

      if (response.ok) {
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRetraining(false);
    }
  };

  return (
    <div id="admin_panel_view_root" className="space-y-6">
      
      {/* 1. Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-isro-blue bg-isro-light-blue px-2.5 py-0.5 rounded-full font-mono">ADMINISTRATIVE ACCESS GATEWAY</span>
          <h2 className="text-xl font-bold font-display text-slate-800 tracking-tight mt-1.5">
            MOSDAC & IMD Telemetry Control Deck
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Perform coordinate dataset injections, compile machine learning weights, and inspect central telemetry pipelines.
          </p>
        </div>

        <button
          onClick={handleRetrain}
          disabled={retraining}
          className="bg-isro-blue text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 hover:bg-blue-800 transition disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw size={14} className={retraining ? "animate-spin" : ""} />
          {retraining ? "COMPILING WEIGHTS..." : "TRIGGER RETRAINING CYCLE"}
        </button>
      </div>

      {/* 2. Grid for uploading files & displaying existing grids */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Upload Form Panel (Left 2 Columns) */}
        <form onSubmit={handleUpload} className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 font-display text-sm border-b border-slate-100 pb-2 flex items-center gap-1.5">
            <Upload size={16} className="text-isro-blue" /> Dataset Injection
          </h3>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide font-mono">File Name (.nc, .csv, .bin, .tiff)</label>
            <input
              type="text"
              required
              placeholder="e.g. INSAT3DR_SST_2026_JUL.nc"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-isro-blue/20 focus:border-isro-blue font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide font-mono">Source Agency</label>
              <select
                value={source}
                onChange={(e: any) => setSource(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-isro-blue/20 font-mono"
              >
                <option value="INSAT Satellite">INSAT Satellite</option>
                <option value="MOSDAC">MOSDAC</option>
                <option value="IMD">IMD</option>
                <option value="Ground Station">Ground Station</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide font-mono">Parameter Tag</label>
              <select
                value={parameter}
                onChange={(e) => setParameter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-isro-blue/20 font-mono"
              >
                <option value="Land Surface Temp (LST)">Land Surface Temp (LST)</option>
                <option value="Sea Surface Temp (SST)">Sea Surface Temp (SST)</option>
                <option value="Gridded Rainfall">Gridded Rainfall</option>
                <option value="Relative Humidity">Relative Humidity</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-isro-yellow text-slate-950 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 hover:bg-amber-400 transition disabled:opacity-50 cursor-pointer uppercase"
          >
            <Plus size={14} /> {uploading ? 'Processing file...' : 'Inject Dataset'}
          </button>
        </form>

        {/* Existing Datasets Table (Right 3 Columns) */}
        <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-[280px]">
          <div>
            <h3 className="font-bold text-slate-800 font-display text-sm border-b border-slate-100 pb-2 flex items-center gap-1.5 mb-3">
              <Database size={16} className="text-isro-blue" /> National Dataset Registries
            </h3>

            <div className="overflow-y-auto max-h-[170px] pr-1">
              <table className="w-full text-left text-xs text-slate-600 font-mono">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400">
                    <th className="py-1 pb-2">File Name</th>
                    <th className="py-1 pb-2">Source</th>
                    <th className="py-1 pb-2">Parameter</th>
                    <th className="py-1 pb-2 text-right">Records</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {datasets.map((ds) => (
                    <tr key={ds.id} className="hover:bg-slate-50/50">
                      <td className="py-2.5 font-semibold text-slate-800 max-w-[150px] truncate">{ds.fileName}</td>
                      <td className="py-2.5"><span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold">{ds.source}</span></td>
                      <td className="py-2.5 text-slate-500">{ds.parameter}</td>
                      <td className="py-2.5 text-right font-bold text-slate-700">{(ds.recordsCount / 1000000).toFixed(2)}M</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Live Server logs console */}
      <div className="bg-slate-950 text-emerald-400 p-5 rounded-2xl border border-slate-800 shadow-lg font-mono">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <span className="text-xs font-bold text-isro-yellow flex items-center gap-2 uppercase">
            <Terminal size={16} className="text-isro-yellow" /> CENTRAL SERVER TELEMETRY LOGS
          </span>
          <span className="text-[10px] text-slate-500">POLLING_SEC: 1.5</span>
        </div>

        <div className="space-y-2 max-h-[220px] overflow-y-auto text-[11px] leading-relaxed pr-1">
          {logs.map((log) => (
            <div key={log.id} className="flex items-start gap-3 border-b border-slate-900 pb-1.5 last:border-none">
              <span className="text-slate-500 shrink-0 select-none">[{log.timestamp.split('T')[1].substring(0,8)}]</span>
              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded shrink-0 uppercase ${
                log.status === 'Success' ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-900/40' : 'bg-amber-950/50 text-amber-400 border border-amber-900/40'
              }`}>{log.status}</span>
              <div>
                <span className="font-bold text-slate-300">[{log.action}]:</span>
                <span className="text-slate-400 ml-1">{log.details}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
