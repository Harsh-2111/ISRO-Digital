import React, { useState } from 'react';
import { MapPin, Search, ZoomIn, ZoomOut, Compass, Layers, AlertCircle, Sparkles } from 'lucide-react';
import { StateClimate, DistrictClimate } from '../types';

interface InteractiveMapProps {
  states: StateClimate[];
  selectedState: StateClimate | null;
  selectedDistrict: DistrictClimate | null;
  onSelectState: (state: StateClimate | null) => void;
  onSelectDistrict: (district: DistrictClimate | null) => void;
  activeLayer: 'temperature' | 'rainfall' | 'humidity' | 'lst' | 'sst';
}

// Stylized state SVG paths and label locations representing the geographic shape of India
// Designed for a highly polished, clean vector feel
interface SVGState {
  id: string;
  name: string;
  path: string;
  textX: number;
  textY: number;
}

const SVG_STATES: SVGState[] = [
  {
    id: "jammu_kashmir",
    name: "Jammu & Kashmir",
    path: "M 150,40 L 190,30 L 210,60 L 180,95 L 145,85 L 140,55 Z",
    textX: 175,
    textY: 55
  },
  {
    id: "rajasthan",
    name: "Rajasthan",
    path: "M 80,140 L 140,110 L 165,150 L 130,210 L 70,185 Z",
    textX: 110,
    textY: 160
  },
  {
    id: "delhi",
    name: "Delhi",
    path: "M 155,120 L 165,120 L 165,130 L 155,130 Z",
    textX: 175,
    textY: 125
  },
  {
    id: "gujarat",
    name: "Gujarat",
    path: "M 40,195 L 85,190 L 110,215 L 105,255 L 75,250 L 60,230 L 35,225 Z",
    textX: 70,
    textY: 220
  },
  {
    id: "maharashtra",
    name: "Maharashtra",
    path: "M 80,255 L 140,225 L 195,250 L 190,310 L 120,335 L 90,295 Z",
    textX: 135,
    textY: 285
  },
  {
    id: "karnataka",
    name: "Karnataka",
    path: "M 105,335 L 135,335 L 160,370 L 145,430 L 115,410 L 105,360 Z",
    textX: 125,
    textY: 380
  },
  {
    id: "kerala",
    name: "Kerala",
    path: "M 125,435 L 140,432 L 142,485 L 130,490 Z",
    textX: 115,
    textY: 465
  },
  {
    id: "tamilnadu",
    name: "Tamil Nadu",
    path: "M 142,430 L 175,415 L 190,445 L 165,490 L 143,485 Z",
    textX: 165,
    textY: 455
  },
  {
    id: "andhra",
    name: "Andhra Pradesh",
    path: "M 140,335 L 190,310 L 210,345 L 190,410 L 165,410 L 150,370 Z",
    textX: 175,
    textY: 360
  },
  {
    id: "bihar",
    name: "Bihar",
    path: "M 220,150 L 270,145 L 280,185 L 230,195 Z",
    textX: 250,
    textY: 170
  },
  {
    id: "westbengal",
    name: "West Bengal",
    path: "M 280,180 L 315,175 L 305,250 L 275,230 L 285,200 Z",
    textX: 295,
    textY: 215
  },
  {
    id: "assam",
    name: "Assam",
    path: "M 320,150 L 375,140 L 390,165 L 340,185 L 320,165 Z",
    textX: 350,
    textY: 165
  }
];

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  states,
  selectedState,
  selectedDistrict,
  onSelectState,
  onSelectDistrict,
  activeLayer
}) => {
  const [hoveredState, setHoveredState] = useState<StateClimate | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Get dynamic coloring based on the currently selected weather layer
  const getFillColor = (stateId: string) => {
    const stateData = states.find(s => s.id === stateId);
    if (!stateData) return '#E2E8F0';

    if (activeLayer === 'temperature') {
      const temp = stateData.averageTemp;
      if (temp > 30) return 'rgba(239, 68, 68, 0.85)'; // hot red
      if (temp > 27) return 'rgba(249, 115, 22, 0.85)'; // orange
      if (temp > 24) return 'rgba(251, 191, 36, 0.85)'; // amber-yellow
      if (temp > 20) return 'rgba(16, 185, 129, 0.85)'; // green
      return 'rgba(59, 130, 246, 0.85)'; // blue
    } else if (activeLayer === 'rainfall') {
      const rain = stateData.totalRainfall;
      if (rain > 2000) return 'rgba(30, 58, 138, 0.85)'; // deep blue
      if (rain > 1200) return 'rgba(29, 78, 216, 0.85)'; // strong blue
      if (rain > 800) return 'rgba(59, 130, 246, 0.85)'; // light blue
      if (rain > 400) return 'rgba(147, 197, 253, 0.85)'; // sky blue
      return 'rgba(254, 243, 199, 0.85)'; // beige-dry
    } else if (activeLayer === 'humidity') {
      const hum = stateData.humidity;
      if (hum > 75) return 'rgba(13, 148, 136, 0.85)'; // dark teal
      if (hum > 65) return 'rgba(20, 184, 166, 0.85)'; // teal
      if (hum > 50) return 'rgba(115, 115, 115, 0.15)'; // light gray
      return 'rgba(245, 158, 11, 0.7)'; // dry orange
    } else if (activeLayer === 'lst') {
      const temp = stateData.averageTemp + 2.5;
      if (temp > 32) return 'rgba(220, 38, 38, 0.9)'; // fire-red
      if (temp > 28) return 'rgba(234, 88, 12, 0.9)'; // orange-red
      return 'rgba(245, 158, 11, 0.9)'; // amber
    } else {
      // SST - only coastal gets color, inland stays soft gray
      const coastalIds = ["maharashtra", "karnataka", "kerala", "tamilnadu", "andhra", "westbengal"];
      if (coastalIds.includes(stateId)) {
        return 'rgba(13, 71, 161, 0.8)';
      }
      return 'rgba(226, 232, 240, 0.4)';
    }
  };

  const getLayerUnit = () => {
    switch (activeLayer) {
      case 'temperature': return '°C';
      case 'rainfall': return 'mm';
      case 'humidity': return '%';
      case 'lst': return '°C';
      case 'sst': return '°C';
    }
  };

  const getLayerValue = (state: StateClimate) => {
    switch (activeLayer) {
      case 'temperature': return `${state.averageTemp} °C`;
      case 'rainfall': return `${state.totalRainfall} mm`;
      case 'humidity': return `${state.humidity}%`;
      case 'lst': return `${(state.averageTemp + 2.4).toFixed(1)} °C`;
      case 'sst':
        const coastalIds = ["maharashtra", "karnataka", "kerala", "tamilnadu", "andhra", "westbengal"];
        return coastalIds.includes(state.id) ? "27.2 °C" : "N/A (Inland)";
    }
  };

  // Search cities, states, or districts
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const results: any[] = [];
    states.forEach(s => {
      if (s.name.toLowerCase().includes(query.toLowerCase()) || s.capital.toLowerCase().includes(query.toLowerCase())) {
        results.push({ type: 'state', id: s.id, name: s.name, parent: s.capital });
      }
      s.districts.forEach(d => {
        if (d.name.toLowerCase().includes(query.toLowerCase())) {
          results.push({ type: 'district', id: d.id, name: d.name, parent: s.name, stateId: s.id, data: d });
        }
      });
    });
    setSearchResults(results.slice(0, 5));
  };

  const selectSearchResult = (item: any) => {
    if (item.type === 'state') {
      const stateObj = states.find(s => s.id === item.id);
      if (stateObj) onSelectState(stateObj);
    } else if (item.type === 'district') {
      const stateObj = states.find(s => s.id === item.stateId);
      if (stateObj) {
        onSelectState(stateObj);
        onSelectDistrict(item.data);
      }
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div id="interactive_map_wrapper" className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-100 p-2.5 relative overflow-hidden">
      
      {/* Top Search & Control bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 mb-2.5 z-10">
        
        {/* Search Input */}
        <div className="relative flex-1 min-w-[160px]">
          <div className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none text-slate-400">
            <Search size={13} />
          </div>
          <input
            type="text"
            placeholder="Search state or city/district..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 pl-8 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-isro-blue/10 focus:border-isro-blue font-mono"
          />
          
          {searchResults.length > 0 && (
            <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-20">
              {searchResults.map((res, idx) => (
                <button
                  key={idx}
                  onClick={() => selectSearchResult(res)}
                  className="w-full flex items-center justify-between px-3 py-2 hover:bg-slate-50 text-left text-xs text-slate-700 border-b border-slate-100 last:border-none"
                >
                  <span className="font-medium text-slate-800">{res.name}</span>
                  <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">
                    {res.type === 'state' ? 'State' : `District, ${res.parent}`}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* State Dropdown Selector */}
        <div className="flex items-center gap-1 shrink-0">
          <select
            id="state_dropdown_selector"
            value={selectedState?.id || ''}
            onChange={(e) => {
              const val = e.target.value;
              if (val) {
                const sObj = states.find(s => s.id === val);
                if (sObj) {
                  onSelectState(sObj);
                  onSelectDistrict(null);
                }
              } else {
                onSelectState(null);
                onSelectDistrict(null);
              }
            }}
            className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg py-1.5 px-2 text-xs focus:outline-none focus:ring-2 focus:ring-isro-blue/10 focus:border-isro-blue font-semibold"
          >
            <option value="">🗺️ -- All India (Select State) --</option>
            {states.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* District Dropdown Selector (Conditional on State selected) */}
        {selectedState && (
          <div className="flex items-center gap-1 shrink-0 animate-fade-in">
            <select
              id="district_dropdown_selector"
              value={selectedDistrict?.id || ''}
              onChange={(e) => {
                const val = e.target.value;
                if (val) {
                  const dObj = selectedState.districts.find(d => d.id === val);
                  if (dObj) {
                    onSelectDistrict(dObj);
                  }
                } else {
                  onSelectDistrict(null);
                }
              }}
              className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg py-1.5 px-2 text-xs focus:outline-none focus:ring-2 focus:ring-isro-blue/10 focus:border-isro-blue font-semibold"
            >
              <option value="">🏙️ -- Whole State (Select City) --</option>
              {selectedState.districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Map Zoom Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button 
            onClick={() => setZoomLevel(prev => Math.min(2.5, prev + 0.25))}
            className="p-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-md text-slate-600 transition"
            title="Zoom In"
          >
            <ZoomIn size={13} />
          </button>
          <button 
            onClick={() => setZoomLevel(prev => Math.max(0.75, prev - 0.25))}
            className="p-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-md text-slate-600 transition"
            title="Zoom Out"
          >
            <ZoomOut size={13} />
          </button>
          <button 
            onClick={() => { setZoomLevel(1); onSelectState(null); onSelectDistrict(null); }}
            className="p-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-md text-slate-600 transition flex items-center gap-1 text-[10px] font-bold"
            title="Reset Map and State"
          >
            <Compass size={11} /> Reset
          </button>
        </div>
      </div>

      {/* Main Map Split Pane */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 relative">
        
        {/* SVG GIS Map Stage */}
        <div className="flex-1 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center p-2 relative min-h-[340px]">
          
          {/* Compass/ISRO Overlay */}
          <div className="absolute top-3 left-3 flex flex-col items-start text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1"><Compass size={12} className="text-isro-blue animate-spin-slow" /> SAT_HEMI: INSAT-3DR</span>
            <span>GRID_RES: 0.25° × 0.25°</span>
            <span>PROJ: WGS-84 / Mercator</span>
          </div>

          <svg 
            viewBox="0 0 450 520" 
            className="w-full max-h-[480px] transition-transform duration-500 ease-out"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <g id="states_group">
              {SVG_STATES.map((state) => {
                const isSelected = selectedState?.id === state.id;
                const isHovered = hoveredState?.id === state.id;
                const stateData = states.find(s => s.id === state.id);
                
                return (
                  <path
                    key={state.id}
                    d={state.path}
                    fill={getFillColor(state.id)}
                    stroke={isSelected ? "#FFC107" : isHovered ? "#0D47A1" : "#FFFFFF"}
                    strokeWidth={isSelected ? 2.5 : isHovered ? 1.5 : 1}
                    className="cursor-pointer transition-all duration-200 hover:brightness-95"
                    onClick={() => {
                      if (stateData) {
                        onSelectState(stateData);
                        onSelectDistrict(null);
                      }
                    }}
                    onMouseEnter={() => {
                      if (stateData) setHoveredState(stateData);
                    }}
                    onMouseLeave={() => setHoveredState(null)}
                  />
                );
              })}
            </g>

            {/* Render Capital Pins */}
            {SVG_STATES.map((state) => {
              const stateData = states.find(s => s.id === state.id);
              if (!stateData) return null;
              
              return (
                <g key={`pin-${state.id}`} className="pointer-events-none">
                  <circle
                    cx={state.textX}
                    cy={state.textY - 8}
                    r={3}
                    fill="#0D47A1"
                    stroke="#FFFFFF"
                    strokeWidth={1}
                  />
                  <text
                    x={state.textX}
                    y={state.textY + 6}
                    textAnchor="middle"
                    className="text-[8px] font-bold fill-slate-800 pointer-events-none select-none bg-white font-display"
                  >
                    {stateData.name}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Color Gradient Legend on Map bottom-right */}
          <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm p-2.5 rounded-lg border border-slate-100 shadow-sm text-[10px] min-w-[120px]">
            <span className="font-semibold text-slate-700 capitalize flex items-center gap-1 mb-1">
              <Layers size={10} className="text-isro-blue" />
              {activeLayer} scale
            </span>
            <div className="h-2 w-full rounded bg-gradient-to-r from-blue-100 via-amber-200 to-red-500 mb-1"></div>
            <div className="flex justify-between text-slate-400 font-mono">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>

          {/* Hover Tooltip Overlay */}
          {hoveredState && (
            <div className="absolute top-3 right-3 bg-white border border-slate-100 p-3 rounded-xl shadow-md pointer-events-none z-10 max-w-[180px] text-xs transition duration-150">
              <div className="font-bold text-slate-800 font-display border-b border-slate-100 pb-1 mb-1.5 flex items-center justify-between">
                <span>{hoveredState.name}</span>
                <span className="h-2 w-2 rounded-full bg-isro-yellow animate-pulse"></span>
              </div>
              <div className="space-y-1 text-slate-600 font-mono">
                <div className="flex justify-between"><span>Avg Temp:</span><span className="font-bold">{hoveredState.averageTemp} °C</span></div>
                <div className="flex justify-between"><span>Rainfall:</span><span className="font-bold">{hoveredState.totalRainfall} mm</span></div>
                <div className="flex justify-between"><span>Humidity:</span><span className="font-bold">{hoveredState.humidity}%</span></div>
                <div className="flex justify-between mt-1 pt-1 border-t border-dashed border-slate-100">
                  <span>Risk Index:</span>
                  <span className={`font-bold ${hoveredState.climateRiskIndex > 75 ? 'text-red-500' : hoveredState.climateRiskIndex > 50 ? 'text-amber-500' : 'text-emerald-500'}`}>
                    {hoveredState.climateRiskIndex}/100
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drill-down State/District Sidebar */}
        <div className="w-full lg:w-48 flex flex-col gap-3 min-h-[140px]">
          
          {selectedState ? (
            <div className="flex-1 bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-1 border-b border-slate-200 mb-2">
                  <h4 className="font-bold text-sm text-isro-blue font-display">{selectedState.name}</h4>
                  <button 
                    onClick={() => { onSelectState(null); onSelectDistrict(null); }}
                    className="text-[10px] text-slate-500 hover:text-red-500 font-mono font-bold"
                  >
                    RESET
                  </button>
                </div>
                
                <p className="text-[10px] text-slate-400 font-mono mb-2 uppercase">Select District Twin</p>
                
                <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
                  {selectedState.districts.map((dist) => {
                    const isDistSelected = selectedDistrict?.id === dist.id;
                    return (
                      <button
                        key={dist.id}
                        onClick={() => onSelectDistrict(dist)}
                        className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg border transition ${
                          isDistSelected
                            ? 'bg-isro-blue border-isro-blue text-white font-semibold glow-blue'
                            : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="truncate">{dist.name}</span>
                          <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${isDistSelected ? 'text-isro-yellow bg-isro-blue' : 'text-slate-400 bg-slate-100'}`}>
                            {dist.metrics.temperature}°C
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedDistrict && (
                <div className="mt-3 pt-2.5 border-t border-slate-200 text-xs">
                  <div className="bg-isro-yellow/10 border border-isro-yellow/30 p-2 rounded-lg flex items-start gap-1.5">
                    <Sparkles size={14} className="text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-800 text-[10px]">Twin Operational:</span>
                      <p className="text-[10px] text-slate-600 font-mono">Telemetry synced with 2025 IMD gridded datasets.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 bg-slate-50 rounded-xl p-3.5 border border-slate-100 flex flex-col items-center justify-center text-center text-slate-400">
              <Compass size={28} className="text-slate-300 mb-2 animate-bounce-slow" />
              <p className="text-xs font-semibold text-slate-500 mb-1">State Explorer</p>
              <p className="text-[10px] text-slate-400 max-w-[140px]">Click any state region on the GIS map to load dynamic district telemetry twins.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
