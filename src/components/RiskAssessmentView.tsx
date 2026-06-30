import React from 'react';
import { StateClimate, DistrictClimate } from '../types';
import { AlertTriangle, Flame, Wind, Droplet, ShieldCheck, Heart, Sparkles, Building } from 'lucide-react';

interface RiskAssessmentViewProps {
  states: StateClimate[];
  selectedState: StateClimate | null;
  selectedDistrict: DistrictClimate | null;
}

export const RiskAssessmentView: React.FC<RiskAssessmentViewProps> = ({
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

  const risk = districtObj.metrics;

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Extreme': return 'bg-red-500 text-white';
      case 'High': return 'bg-rose-500 text-white';
      case 'Moderate': return 'bg-amber-400 text-slate-900';
      default: return 'bg-emerald-500 text-white';
    }
  };

  const riskFactors = [
    { title: "Heatwave Intensity", level: risk.heatwaveDays > 12 ? 'High' : 'Moderate', icon: Flame, desc: "Reflects consecutive extreme dry-bulb warming cycles above 42°C threshold limits." },
    { title: "Pluvial Flood Risk", level: risk.floodRisk, icon: AlertTriangle, desc: "Heavy cloudburst runoff probability computed from soil saturation gradients." },
    { title: "Cyclone Wind Stress", level: risk.cycloneRisk, icon: Wind, desc: "Thermal-gradient wind velocity hazard thresholds mapped for coastal bands." },
    { title: "Agronomic Stress", level: risk.agricultureRisk, icon: Sparkles, desc: "Composite soil degradation risk affecting crop transpiration during sowing seasons." },
    { title: "Water Stress Matrix", level: risk.waterStress, icon: Droplet, desc: "Ground aquifer depletion rates vs municipal and agricultural intake quotas." },
    { title: "Urban Heat Island", level: risk.urbanHeatIsland, icon: Building, desc: "Trapped nocturnal heat plumes within asphalt and vertical concrete geometries." }
  ];

  return (
    <div id="risk_assessment_view_root" className="space-y-6">
      
      {/* Title */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-1.5 mb-1">
          <AlertTriangle size={16} className="text-red-500" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">National Risk Grid Registry</span>
        </div>
        <h2 className="text-xl font-bold font-display text-slate-800 tracking-tight">
          Climate Vulnerability Grid: {locationLabel}
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Review multidimensional climatic hazard thresholds evaluated through combined physical equations and INSAT telemetry.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {riskFactors.map((factor, idx) => {
          const Icon = factor.icon;
          return (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-slate-700">
                    <Icon size={18} />
                  </div>
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase font-mono ${getRiskColor(factor.level)}`}>
                    {factor.level} RISK
                  </span>
                </div>

                <h4 className="font-bold text-slate-800 font-display text-xs pt-1">{factor.title}</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">{factor.desc}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-400 font-mono">
                <span>SENSOR REF: INSAT_3D</span>
                <span>CRITICAL_LIMIT: 85%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Safety recommendations panel */}
      <div className="bg-isro-blue text-white p-5 rounded-2xl flex items-start gap-4">
        <div className="bg-white/10 p-3 rounded-2xl border border-white/10 text-isro-yellow">
          <ShieldCheck size={28} />
        </div>
        <div>
          <h4 className="font-bold font-display text-sm mb-1">ISRO Space Climatology Command Directives</h4>
          <p className="text-xs text-isro-light-blue leading-relaxed max-w-2xl font-mono">
            Vulnerability index in {locationLabel} suggests moderate topsoil moisture stress. Local departments are advised to deploy drip irrigation channels and preserve municipal wetland buffers to reduce Urban Heat Island thermal retention during summer intervals.
          </p>
        </div>
      </div>

    </div>
  );
};
