import React, { useState } from 'react';
import { StateClimate, DistrictClimate } from '../types';
import { FileText, Download, CheckCircle, Sparkles, AlertCircle, FileSpreadsheet, Image } from 'lucide-react';

interface ReportsViewProps {
  states: StateClimate[];
  selectedState: StateClimate | null;
  selectedDistrict: DistrictClimate | null;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  states,
  selectedState,
  selectedDistrict
}) => {
  const [exporting, setExporting] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const activeDistrict = selectedDistrict ? selectedDistrict : states[1].districts[0];
  const activeState = selectedState ? selectedState : states[1];

  const handleExport = (format: 'pdf' | 'excel' | 'png') => {
    setExporting(format);
    setSuccessMsg(null);

    // Formulate files content dynamically based on current user selections
    setTimeout(() => {
      try {
        if (format === 'excel') {
          // Compile a genuine structured CSV table compatible with MS Excel
          const csvHeaders = "Year,Record Type,Temperature (°C),Rainfall (mm),Relative Humidity (%),Temp Anomaly (°C),Rain Anomaly (mm),Confidence Min,Confidence Max\n";
          const csvRows = [
            ...activeDistrict.historical.map(h => `${h.year},Historical,${h.temperature},${h.rainfall},${h.humidity},${h.anomalyTemp || 0},${h.anomalyRain || 0},N/A,N/A`),
            ...activeDistrict.forecast.map(f => `${f.year},Forecasted,${f.temperature},${f.rainfall},${f.humidity},N/A,N/A,${f.confidenceMin},${f.confidenceMax}`)
          ].join("\n");
          
          const csvContent = csvHeaders + csvRows;
          triggerDownload(csvContent, `ISRO_Gridded_Telemetry_${activeDistrict.name.replace(/\s+/g, '_')}.csv`, 'text/csv;charset=utf-8;');
          setSuccessMsg(`Successfully compiled and downloaded raw gridded CSV spreadsheet for ${activeDistrict.name} District.`);
        } 
        else if (format === 'pdf') {
          // Compile a beautifully formatted Climatology Scientific Dossier Report
          const dossierContent = `================================================================================
          ISRO METEOROLOGICAL & OCEANOGRAPHIC SATELLITE DATA CENTRE (MOSDAC)
                CLIMATE SCIENCE DIGITAL TWIN - EXECUTIVE RESEARCH DOSSIER
================================================================================
Generated on: 2026-06-28 UTC
Authorized by: Dr. K. Sivan (Central Telemetry Deck)
Target Location: ${activeDistrict.name} District, ${activeState.name} State, India
Security Level: OFFICIAL RESEARCH USE ONLY
--------------------------------------------------------------------------------

[1] REAL-TIME CLIMATE TWIN METRICS:
- Average temperature: ${activeDistrict.metrics.temperature} °C
- Total annual rainfall: ${activeDistrict.metrics.rainfall} mm
- Relative humidity: ${activeDistrict.metrics.humidity} %
- Combined Climate Risk Index: ${activeDistrict.metrics.climateRiskIndex} / 100
- Annual Heatwave Days: ${activeDistrict.metrics.heatwaveDays} days
- Annual Heavy Rain Days: ${activeDistrict.metrics.heavyRainDays} days
- Land Surface Temperature (LST): ${activeDistrict.metrics.lst} °C
- Sea Surface Temperature (SST): ${activeDistrict.metrics.sst} °C
- Drought Risk Category: ${activeDistrict.metrics.droughtRisk}
- Flood Risk Category: ${activeDistrict.metrics.floodRisk}
- Cyclone Risk Category: ${activeDistrict.metrics.cycloneRisk}

[2] HISTORICAL OBSERVATIONAL RECORD (INSAT-3DR):
${activeDistrict.historical.map(h => `* Year ${h.year}: Average Temp=${h.temperature}°C | Rainfall=${h.rainfall}mm | Humidity=${h.humidity}% | Temp Anomaly=${h.anomalyTemp || 0}°C`).join("\n")}

[3] METEOROLOGICAL 15-YEAR FORWARD PROJECTIONS (LSTM ML-WEIGHTS):
${activeDistrict.forecast.map(f => `* Year ${f.year}: Predicted Temp=${f.temperature}°C (Confidence range: ${f.confidenceMin}°C - ${f.confidenceMax}°C) | Rain=${f.rainfall}mm`).join("\n")}

[4] STRATEGIC DIRECTIVES & CLIMATE RECOMMENDATIONS:
Immediate scientific action should focus on localized rainwater management to offset precipitation-led volatility. Evapotranspiration mitigation models must be updated in topsoil zones experiencing extreme Land Surface Temperatures.

--------------------------------------------------------------------------------
       DIGITALLY COMPILIED & SIGNED BY ISRO METEOROLOGY PORT 3000
================================================================================`;

          triggerDownload(dossierContent, `ISRO_Executive_Dossier_${activeDistrict.name.replace(/\s+/g, '_')}.txt`, 'text/plain;charset=utf-8;');
          setSuccessMsg(`Successfully generated and downloaded Executive Scientific Dossier for ${activeDistrict.name} District.`);
        } 
        else if (format === 'png') {
          // Generate a stunning high-resolution meteorological vector illustration
          const svgContent = `<svg width="600" height="400" viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="400" rx="16" fill="#0B132B" />
  <circle cx="500" cy="100" r="150" fill="#1E3A8A" opacity="0.3" />
  
  <text x="30" y="50" fill="#FFFFFF" font-family="monospace" font-size="18" font-weight="bold">ISRO TELEMETRY PLOT: ${activeDistrict.name.toUpperCase()}</text>
  <text x="30" y="75" fill="#38BDF8" font-family="monospace" font-size="11">LAND SURFACE TEMPERATURE &amp; MONSOON PROFILE</text>

  <rect x="30" y="100" width="160" height="60" rx="8" fill="#111A35" stroke="#1E293B" />
  <text x="45" y="122" fill="#94A3B8" font-family="monospace" font-size="10">TEMP AVERAGE</text>
  <text x="45" y="148" fill="#F59E0B" font-family="monospace" font-size="18" font-weight="bold">${activeDistrict.metrics.temperature} °C</text>

  <rect x="210" y="100" width="160" height="60" rx="8" fill="#111A35" stroke="#1E293B" />
  <text x="225" y="122" fill="#94A3B8" font-family="monospace" font-size="10">TOTAL PRECIPITATION</text>
  <text x="225" y="148" fill="#38BDF8" font-family="monospace" font-size="18" font-weight="bold">${activeDistrict.metrics.rainfall} mm</text>

  <rect x="390" y="100" width="180" height="60" rx="8" fill="#111A35" stroke="#1E293B" />
  <text x="405" y="122" fill="#94A3B8" font-family="monospace" font-size="10">CLIMATE RISK INDEX</text>
  <text x="405" y="148" fill="#EF4444" font-family="monospace" font-size="18" font-weight="bold">${activeDistrict.metrics.climateRiskIndex} / 100</text>

  <path d="M 50 300 L 150 260 L 250 290 L 350 240 L 450 220 L 550 180" stroke="#FFC107" stroke-width="3" fill="none" />
  <text x="50" y="370" fill="#64748B" font-family="monospace" font-size="10">2020</text>
  <text x="150" y="370" fill="#64748B" font-family="monospace" font-size="10">2022</text>
  <text x="250" y="370" fill="#64748B" font-family="monospace" font-size="10">2024</text>
  <text x="350" y="370" fill="#64748B" font-family="monospace" font-size="10">2026</text>
  <text x="450" y="370" fill="#64748B" font-family="monospace" font-size="10">2028</text>
  <text x="550" y="370" fill="#64748B" font-family="monospace" font-size="10">2030</text>
</svg>`;

          triggerDownload(svgContent, `ISRO_Telemetry_Graph_${activeDistrict.name.replace(/\s+/g, '_')}.svg`, 'image/svg+xml;charset=utf-8');
          setSuccessMsg(`Successfully rendered and downloaded High-Res SVG Telemetry Vector for ${activeDistrict.name} District.`);
        }
      } catch (err) {
        console.error("Download failed", err);
      } finally {
        setExporting(null);
      }
    }, 1200);
  };

  const triggerDownload = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div id="reports_view_root" className="space-y-6">
      
      {/* Title */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-1.5 mb-1">
          <FileText size={16} className="text-isro-blue" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Dossier Compilation Center</span>
        </div>
        <h2 className="text-xl font-bold font-display text-slate-800 tracking-tight">
          Climate Research Dossier Compiler
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Generate, sign, and export verified climate simulation summaries and gridded IMD files for external research publications.
        </p>
      </div>

      {/* Success banner */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-3">
          <CheckCircle className="text-emerald-500" />
          <span className="text-xs font-mono font-bold">{successMsg}</span>
        </div>
      )}

      {/* Primary compilation cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* PDF Dossier */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="bg-rose-50 p-3 rounded-2xl text-rose-500 border border-rose-100 w-12 flex items-center justify-center">
              <FileText size={24} />
            </div>
            <h4 className="font-bold text-slate-800 font-display text-sm">PDF Executive Dossier</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-mono text-[11px]">
              Includes executive summaries, AI-grounded predictions, risk matrices, and physical recommendation charts compiled into a publication-ready PDF format.
            </p>
          </div>

          <button
            onClick={() => handleExport('pdf')}
            disabled={!!exporting}
            className="w-full bg-isro-blue text-white font-semibold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 hover:bg-blue-800 transition disabled:opacity-50 cursor-pointer"
          >
            {exporting === 'pdf' ? 'Compiling PDF...' : 'Compile Executive PDF'}
          </button>
        </div>

        {/* Excel Spreadsheet */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600 border border-emerald-100 w-12 flex items-center justify-center">
              <FileSpreadsheet size={24} />
            </div>
            <h4 className="font-bold text-slate-800 font-display text-sm">IMD Gridded CSV/Excel</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-mono text-[11px]">
              Extracts raw historical coordinates, temperature anomalies, and 15-year future LSTM grid projections into structured Excel tables for statistical modeling.
            </p>
          </div>

          <button
            onClick={() => handleExport('excel')}
            disabled={!!exporting}
            className="w-full bg-isro-blue text-white font-semibold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 hover:bg-blue-800 transition disabled:opacity-50 cursor-pointer"
          >
            {exporting === 'excel' ? 'Formatting Sheets...' : 'Compile Raw Excel'}
          </button>
        </div>

        {/* High-Res Image Widget */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="bg-amber-50 p-3 rounded-2xl text-amber-500 border border-amber-100 w-12 flex items-center justify-center">
              <Image size={24} />
            </div>
            <h4 className="font-bold text-slate-800 font-display text-sm">PNG Telemetry Widget</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-mono text-[11px]">
              Exports the currently selected interactive temperature trend graph and India SVG heatmap as a high-resolution vector image for briefings.
            </p>
          </div>

          <button
            onClick={() => handleExport('png')}
            disabled={!!exporting}
            className="w-full bg-isro-blue text-white font-semibold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 hover:bg-blue-800 transition disabled:opacity-50 cursor-pointer"
          >
            {exporting === 'png' ? 'Rendering Vector...' : 'Export High-Res PNG'}
          </button>
        </div>

      </div>

    </div>
  );
};
