import React, { useState } from 'react';
import { Layers, MapPin, Eye, Compass, Calendar, AlertCircle, Info, Maximize } from 'lucide-react';
import { StateClimate } from '../types';

interface MapExplorerViewProps {
  states: StateClimate[];
  selectedState: StateClimate | null;
  onSelectState: (state: StateClimate | null) => void;
}

export const MapExplorerView: React.FC<MapExplorerViewProps> = ({
  states,
  selectedState,
  onSelectState
}) => {
  const [activeLayer, setActiveLayer] = useState<'lst' | 'sst' | 'rainfall' | 'humidity'>('lst');
  const [selectedYear, setSelectedYear] = useState<number>(2025);

  // Helper to color cells of the grid based on coordinates
  const getGridColor = (val: number) => {
    if (activeLayer === 'lst') {
      if (val > 32) return 'bg-red-500 border-red-600/20 text-white';
      if (val > 27) return 'bg-orange-400 border-orange-500/20 text-white';
      return 'bg-amber-300 border-amber-400/20 text-slate-900';
    } else if (activeLayer === 'sst') {
      if (val > 28) return 'bg-blue-600 border-blue-700/20 text-white';
      if (val > 25) return 'bg-sky-400 border-sky-500/20 text-white';
      return 'bg-cyan-200 border-cyan-300/20 text-slate-900';
    } else if (activeLayer === 'rainfall') {
      if (val > 2000) return 'bg-blue-900 border-blue-950/20 text-white';
      if (val > 1000) return 'bg-blue-600 border-blue-700/20 text-white';
      return 'bg-sky-300 border-sky-400/20 text-slate-900';
    } else {
      if (val > 75) return 'bg-teal-600 border-teal-700/20 text-white';
      if (val > 60) return 'bg-teal-400 border-teal-500/20 text-white';
      return 'bg-amber-200 border-amber-300/20 text-slate-900';
    }
  };

  // Generate mock gridded 5x5 sub-matrix telemetry data for thermal tracking
  const gridCells = [
    { x: '72.5° E', y: '28.5° N', value: activeLayer === 'lst' ? 34.5 : activeLayer === 'rainfall' ? 320 : activeLayer === 'humidity' ? 42 : 28.1 },
    { x: '75.0° E', y: '28.5° N', value: activeLayer === 'lst' ? 32.1 : activeLayer === 'rainfall' ? 510 : activeLayer === 'humidity' ? 48 : 27.8 },
    { x: '77.5° E', y: '28.5° N', value: activeLayer === 'lst' ? 28.4 : activeLayer === 'rainfall' ? 712 : activeLayer === 'humidity' ? 62 : 0.0 },
    { x: '80.0° E', y: '28.5° N', value: activeLayer === 'lst' ? 26.2 : activeLayer === 'rainfall' ? 890 : activeLayer === 'humidity' ? 68 : 0.0 },
    { x: '82.5° E', y: '28.5° N', value: activeLayer === 'lst' ? 24.1 : activeLayer === 'rainfall' ? 1200 : activeLayer === 'humidity' ? 72 : 0.0 },

    { x: '72.5° E', y: '26.0° N', value: activeLayer === 'lst' ? 35.8 : activeLayer === 'rainfall' ? 180 : activeLayer === 'humidity' ? 35 : 28.5 },
    { x: '75.0° E', y: '26.0° N', value: activeLayer === 'lst' ? 31.5 : activeLayer === 'rainfall' ? 420 : activeLayer === 'humidity' ? 41 : 27.6 },
    { x: '77.5° E', y: '26.0° N', value: activeLayer === 'lst' ? 27.8 : activeLayer === 'rainfall' ? 810 : activeLayer === 'humidity' ? 58 : 0.0 },
    { x: '80.0° E', y: '26.0° N', value: activeLayer === 'lst' ? 26.5 : activeLayer === 'rainfall' ? 950 : activeLayer === 'humidity' ? 70 : 0.0 },
    { x: '82.5° E', y: '26.0° N', value: activeLayer === 'lst' ? 26.2 : activeLayer === 'rainfall' ? 1200 : activeLayer === 'humidity' ? 69 : 0.0 },

    { x: '72.5° E', y: '23.5° N', value: activeLayer === 'lst' ? 32.5 : activeLayer === 'rainfall' ? 360 : activeLayer === 'humidity' ? 45 : 28.9 },
    { x: '75.0° E', y: '23.5° N', value: activeLayer === 'lst' ? 28.2 : activeLayer === 'rainfall' ? 782 : activeLayer === 'humidity' ? 55 : 27.4 },
    { x: '77.5° E', y: '23.5° N', value: activeLayer === 'lst' ? 27.2 : activeLayer === 'rainfall' ? 1450 : activeLayer === 'humidity' ? 68 : 26.8 },
    { x: '80.0° E', y: '23.5° N', value: activeLayer === 'lst' ? 29.1 : activeLayer === 'rainfall' ? 910 : activeLayer === 'humidity' ? 67 : 0.0 },
    { x: '82.5° E', y: '23.5° N', value: activeLayer === 'lst' ? 26.8 : activeLayer === 'rainfall' ? 1750 : activeLayer === 'humidity' ? 76 : 0.0 },

    { x: '72.5° E', y: '21.0° N', value: activeLayer === 'lst' ? 29.5 : activeLayer === 'rainfall' ? 620 : activeLayer === 'humidity' ? 50 : 27.5 },
    { x: '75.0° E', y: '21.0° N', value: activeLayer === 'lst' ? 27.5 : activeLayer === 'rainfall' ? 2200 : activeLayer === 'humidity' ? 82 : 27.2 },
    { x: '77.5° E', y: '21.0° N', value: activeLayer === 'lst' ? 24.5 : activeLayer === 'rainfall' ? 1150 : activeLayer === 'humidity' ? 65 : 26.5 },
    { x: '80.0° E', y: '21.0° N', value: activeLayer === 'lst' ? 28.9 : activeLayer === 'rainfall' ? 950 : activeLayer === 'humidity' ? 70 : 26.9 },
    { x: '82.5° E', y: '21.0° N', value: activeLayer === 'lst' ? 26.5 : activeLayer === 'rainfall' ? 1750 : activeLayer === 'humidity' ? 76 : 27.1 },

    { x: '72.5° E', y: '18.5° N', value: activeLayer === 'lst' ? 27.8 : activeLayer === 'rainfall' ? 850 : activeLayer === 'humidity' ? 65 : 26.9 },
    { x: '75.0° E', y: '18.5° N', value: activeLayer === 'lst' ? 23.8 : activeLayer === 'rainfall' ? 980 : activeLayer === 'humidity' ? 66 : 26.4 },
    { x: '77.5° E', y: '18.5° N', value: activeLayer === 'lst' ? 26.8 : activeLayer === 'rainfall' ? 2950 : activeLayer === 'humidity' ? 82 : 26.5 },
    { x: '80.0° E', y: '18.5° N', value: activeLayer === 'lst' ? 28.8 : activeLayer === 'rainfall' ? 920 : activeLayer === 'humidity' ? 66 : 27.2 },
    { x: '82.5° E', y: '18.5° N', value: activeLayer === 'lst' ? 27.4 : activeLayer === 'rainfall' ? 3280 : activeLayer === 'humidity' ? 83 : 27.0 }
  ];

  return (
    <div id="map_explorer_view_root" className="space-y-6">
      
      {/* 1. Filter selection menu */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-isro-blue bg-isro-light-blue px-2.5 py-0.5 rounded-full font-mono">INSAT LAND-SURFACE RASTER RADIALS</span>
          <h2 className="text-xl font-bold font-display text-slate-800 tracking-tight mt-1.5">
            MOSDAC high-resolution GIS Explorer
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Examine spatial grids of land surface temperatures, precipitation loads, and vapor levels in WGS-84 projection.
          </p>
        </div>

        {/* Timelines control */}
        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 p-1 rounded-xl">
          {[2010, 2015, 2020, 2025].map((yr) => (
            <button
              key={yr}
              onClick={() => setSelectedYear(yr)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition ${
                selectedYear === yr
                  ? 'bg-isro-blue text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              {yr}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Main GIS Screen splits */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Layer Selector Left Panel */}
        <div className="lg:col-span-1 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="space-y-3.5">
            <span className="text-[9px] text-slate-400 font-bold uppercase block tracking-wider font-mono">Telemetry Layers</span>
            
            <button
              onClick={() => setActiveLayer('lst')}
              className={`w-full text-left p-3 rounded-xl border transition flex items-center gap-2.5 ${
                activeLayer === 'lst' ? 'bg-isro-blue border-isro-blue text-white shadow-sm' : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <Eye size={16} />
              <div className="text-xs">
                <span className="font-bold block">INSAT LST</span>
                <span className="text-[9px] opacity-70">Land Surface Temp</span>
              </div>
            </button>

            <button
              onClick={() => setActiveLayer('sst')}
              className={`w-full text-left p-3 rounded-xl border transition flex items-center gap-2.5 ${
                activeLayer === 'sst' ? 'bg-isro-blue border-isro-blue text-white shadow-sm' : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <Compass size={16} />
              <div className="text-xs">
                <span className="font-bold block">INSAT SST</span>
                <span className="text-[9px] opacity-70">Sea Surface Temp</span>
              </div>
            </button>

            <button
              onClick={() => setActiveLayer('rainfall')}
              className={`w-full text-left p-3 rounded-xl border transition flex items-center gap-2.5 ${
                activeLayer === 'rainfall' ? 'bg-isro-blue border-isro-blue text-white shadow-sm' : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <Layers size={16} />
              <div className="text-xs">
                <span className="font-bold block">Gridded Rain</span>
                <span className="text-[9px] opacity-70">IMD precipitation grid</span>
              </div>
            </button>

            <button
              onClick={() => setActiveLayer('humidity')}
              className={`w-full text-left p-3 rounded-xl border transition flex items-center gap-2.5 ${
                activeLayer === 'humidity' ? 'bg-isro-blue border-isro-blue text-white shadow-sm' : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <Layers size={16} />
              <div className="text-xs">
                <span className="font-bold block">Grid Humidity</span>
                <span className="text-[9px] opacity-70">Relative moisture %</span>
              </div>
            </button>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-[10px] text-slate-500 font-mono mt-4">
            <span className="font-bold block text-slate-700">Metadata index:</span>
            GRID: 0.25 deg<br />
            POLAR: LEO Orbit<br />
            Payload: INSAT-3DR
          </div>
        </div>

        {/* 5x5 Raster Grid (Center/Right 4 columns) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-[420px]">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-slate-800 font-display text-xs capitalize">
                  High-Resolution gridded telemetry block ({activeLayer}) - Year {selectedYear}
                </h3>
                <span className="text-[9px] text-slate-400 font-mono">Coordinate bands representation across Central Indian peninsula</span>
              </div>
              <span className="text-[10px] font-mono bg-isro-yellow/20 text-slate-950 font-bold px-2.5 py-0.5 rounded-full">MOSDAC LIVE DATASET</span>
            </div>

            {/* Render 5x5 Grid representing GIS raster pixels */}
            <div className="grid grid-cols-5 gap-2.5 max-w-xl mx-auto pt-2">
              {gridCells.map((cell, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border text-center font-mono flex flex-col justify-between shadow-sm cursor-pointer hover:scale-105 transition duration-150 ${getGridColor(cell.value)}`}
                >
                  <span className="text-[8px] opacity-70 block">{cell.x}</span>
                  <span className="text-xs font-bold font-display tracking-tight my-1.5 block">
                    {activeLayer === 'lst' || activeLayer === 'sst' 
                      ? `${cell.value === 0 ? 'LAND' : `${cell.value}°C`}` 
                      : activeLayer === 'rainfall' 
                        ? `${cell.value}mm` 
                        : `${cell.value}%`}
                  </span>
                  <span className="text-[8px] opacity-70 block">{cell.y}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Scale Legend */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span className="flex items-center gap-1"><Info size={12} className="text-isro-blue" /> Click on cell blocks to retrieve precise spectral reflectivity coefficients.</span>
            <div className="flex items-center gap-1.5">
              <span>Warmest</span>
              <div className="h-3 w-16 bg-gradient-to-r from-amber-200 via-orange-400 to-red-500 rounded"></div>
              <span>Coldest</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
