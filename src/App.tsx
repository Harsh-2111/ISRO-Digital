import React, { useState, useEffect } from 'react';
import { 
  Sidebar as SidebarIcon, 
  User, 
  Bell, 
  Search, 
  Compass, 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle,
  X,
  Send,
  Loader,
  Satellite,
  Lock,
  Moon,
  Sun,
  Layers,
  Database,
  Volume2,
  Menu
} from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { IsroLogo } from './components/IsroLogo';
import { CustomCursor } from './components/CustomCursor';
import { DashboardView } from './components/DashboardView';
import { MapExplorerView } from './components/MapExplorerView';
import { ClimateOverviewView } from './components/ClimateOverviewView';
import { AIPredictionsView } from './components/AIPredictionsView';
import { WhatIfSimulationView } from './components/WhatIfSimulationView';
import { RiskAssessmentView } from './components/RiskAssessmentView';
import { ReportsView } from './components/ReportsView';
import { AdminPanelView } from './components/AdminPanelView';
import { StateClimate, DistrictClimate, ClimateAlert } from './types';

// Standard fallback structures in case API is still mounting
const fallbackStates: StateClimate[] = [
  {
    id: "delhi",
    name: "Delhi",
    capital: "New Delhi",
    lat: 28.6139,
    lng: 77.2090,
    averageTemp: 28.4,
    totalRainfall: 712,
    humidity: 62,
    climateRiskIndex: 72,
    districts: [
      {
        id: "new_delhi",
        name: "New Delhi",
        state: "Delhi",
        metrics: {
          temperature: 28.4,
          rainfall: 712,
          humidity: 62,
          climateRiskIndex: 72,
          heatwaveDays: 18,
          heavyRainDays: 12,
          droughtRisk: 'Moderate',
          floodRisk: 'Low',
          cycloneRisk: 'Low',
          agricultureRisk: 'Moderate',
          waterStress: 'High',
          urbanHeatIsland: 'Extreme',
          lst: 30.8,
          sst: 0.0
        },
        historical: [
          { year: 2020, temperature: 28.1, rainfall: 710, humidity: 62, anomalyTemp: 0.3, anomalyRain: 5 },
          { year: 2021, temperature: 28.3, rainfall: 730, humidity: 63, anomalyTemp: 0.5, anomalyRain: 25 },
          { year: 2022, temperature: 28.6, rainfall: 690, humidity: 60, anomalyTemp: 0.8, anomalyRain: -15 },
          { year: 2023, temperature: 28.5, rainfall: 750, humidity: 64, anomalyTemp: 0.7, anomalyRain: 45 },
          { year: 2024, temperature: 28.8, rainfall: 680, humidity: 59, anomalyTemp: 1.0, anomalyRain: -25 },
          { year: 2025, temperature: 28.9, rainfall: 720, humidity: 61, anomalyTemp: 1.1, anomalyRain: 15 }
        ],
        forecast: [
          { year: 2026, temperature: 29.2, rainfall: 710, humidity: 60, confidenceMin: 28.8, confidenceMax: 29.6 },
          { year: 2027, temperature: 29.4, rainfall: 730, humidity: 61, confidenceMin: 28.9, confidenceMax: 29.9 },
          { year: 2028, temperature: 29.5, rainfall: 700, humidity: 59, confidenceMin: 28.9, confidenceMax: 30.1 },
          { year: 2029, temperature: 29.7, rainfall: 740, humidity: 62, confidenceMin: 29.0, confidenceMax: 30.4 },
          { year: 2030, temperature: 29.9, rainfall: 690, humidity: 58, confidenceMin: 29.1, confidenceMax: 30.7 }
        ],
        models: [
          { name: "Linear Regression", rmse: 1.15, mae: 0.88, mape: 3.12, r2: 0.74, isSelected: false },
          { name: "XGBoost", rmse: 0.42, mae: 0.31, mape: 1.10, r2: 0.94, isSelected: true }
        ]
      }
    ]
  },
  {
    id: "maharashtra",
    name: "Maharashtra",
    capital: "Mumbai",
    lat: 19.7515,
    lng: 75.7139,
    averageTemp: 27.2,
    totalRainfall: 1450,
    humidity: 68,
    climateRiskIndex: 64,
    districts: [
      {
        id: "mumbai_city",
        name: "Mumbai City",
        state: "Maharashtra",
        metrics: {
          temperature: 27.5,
          rainfall: 2200,
          humidity: 82,
          climateRiskIndex: 64,
          heatwaveDays: 8,
          heavyRainDays: 32,
          droughtRisk: 'Low',
          floodRisk: 'High',
          cycloneRisk: 'Moderate',
          agricultureRisk: 'Low',
          waterStress: 'Moderate',
          urbanHeatIsland: 'High',
          lst: 29.1,
          sst: 27.2
        },
        historical: [
          { year: 2020, temperature: 27.2, rainfall: 2150, humidity: 81, anomalyTemp: 0.2, anomalyRain: 50 },
          { year: 2021, temperature: 27.3, rainfall: 2300, humidity: 83, anomalyTemp: 0.3, anomalyRain: 200 },
          { year: 2022, temperature: 27.5, rainfall: 2100, humidity: 80, anomalyTemp: 0.5, anomalyRain: 0 },
          { year: 2023, temperature: 27.4, rainfall: 2250, humidity: 82, anomalyTemp: 0.4, anomalyRain: 150 },
          { year: 2024, temperature: 27.7, rainfall: 2050, humidity: 79, anomalyTemp: 0.7, anomalyRain: -50 },
          { year: 2025, temperature: 27.8, rainfall: 2220, humidity: 81, anomalyTemp: 0.8, anomalyRain: 120 }
        ],
        forecast: [
          { year: 2026, temperature: 28.0, rainfall: 2210, humidity: 80, confidenceMin: 27.6, confidenceMax: 28.4 },
          { year: 2027, temperature: 28.2, rainfall: 2280, humidity: 81, confidenceMin: 27.7, confidenceMax: 28.7 },
          { year: 2028, temperature: 28.3, rainfall: 2190, humidity: 79, confidenceMin: 27.7, confidenceMax: 28.9 },
          { year: 2029, temperature: 28.5, rainfall: 2340, humidity: 82, confidenceMin: 27.8, confidenceMax: 29.2 },
          { year: 2030, temperature: 28.7, rainfall: 2150, humidity: 78, confidenceMin: 27.9, confidenceMax: 29.5 }
        ],
        models: [
          { name: "Linear Regression", rmse: 1.15, mae: 0.88, mape: 3.12, r2: 0.74, isSelected: false },
          { name: "XGBoost", rmse: 0.42, mae: 0.31, mape: 1.10, r2: 0.94, isSelected: true }
        ]
      }
    ]
  },
  {
    id: "rajasthan",
    name: "Rajasthan",
    capital: "Jaipur",
    lat: 27.0238,
    lng: 74.2179,
    averageTemp: 31.8,
    totalRainfall: 420,
    humidity: 41,
    climateRiskIndex: 85,
    districts: [
      {
        id: "jaipur",
        name: "Jaipur",
        state: "Rajasthan",
        metrics: {
          temperature: 31.2,
          rainfall: 520,
          humidity: 45,
          climateRiskIndex: 85,
          heatwaveDays: 28,
          heavyRainDays: 4,
          droughtRisk: 'Extreme',
          floodRisk: 'Low',
          cycloneRisk: 'Low',
          agricultureRisk: 'High',
          waterStress: 'Extreme',
          urbanHeatIsland: 'High',
          lst: 33.6,
          sst: 0.0
        },
        historical: [
          { year: 2020, temperature: 30.8, rainfall: 500, humidity: 44, anomalyTemp: 0.4, anomalyRain: 10 },
          { year: 2021, temperature: 30.9, rainfall: 540, humidity: 46, anomalyTemp: 0.5, anomalyRain: 50 },
          { year: 2022, temperature: 31.1, rainfall: 480, humidity: 43, anomalyTemp: 0.7, anomalyRain: -10 },
          { year: 2023, temperature: 31.3, rainfall: 560, humidity: 47, anomalyTemp: 0.9, anomalyRain: 70 },
          { year: 2024, temperature: 31.5, rainfall: 460, humidity: 42, anomalyTemp: 1.1, anomalyRain: -30 },
          { year: 2025, temperature: 31.7, rainfall: 510, humidity: 44, anomalyTemp: 1.3, anomalyRain: 20 }
        ],
        forecast: [
          { year: 2026, temperature: 32.0, rainfall: 510, humidity: 43, confidenceMin: 31.6, confidenceMax: 32.4 },
          { year: 2027, temperature: 32.2, rainfall: 535, humidity: 44, confidenceMin: 31.7, confidenceMax: 32.7 },
          { year: 2028, temperature: 32.4, rainfall: 495, humidity: 42, confidenceMin: 31.8, confidenceMax: 33.0 },
          { year: 2029, temperature: 32.6, rainfall: 550, humidity: 45, confidenceMin: 31.9, confidenceMax: 33.3 },
          { year: 2030, temperature: 32.8, rainfall: 480, humidity: 41, confidenceMin: 32.0, confidenceMax: 33.6 }
        ],
        models: [
          { name: "Linear Regression", rmse: 1.15, mae: 0.88, mape: 3.12, r2: 0.74, isSelected: false },
          { name: "XGBoost", rmse: 0.42, mae: 0.31, mape: 1.10, r2: 0.94, isSelected: true }
        ]
      }
    ]
  }
];

const fallbackAlerts: ClimateAlert[] = [
  { id: "alt-01", title: "Heatwave Warning in Rajasthan", severity: "High", state: "Rajasthan", validUntil: "2026-07-02", description: "Severe heatwave conditions expected with temperatures crossing 46°C in Jaisalmer, Bikaner, and Jodhpur. Avoid outdoor exposures between 11 AM and 4 PM.", type: "Heatwave" },
  { id: "alt-02", title: "Heavy Rainfall Expected in Kerala", severity: "Medium", state: "Kerala", validUntil: "2026-06-30", description: "Active monsoon currents likely to trigger extremely heavy downpours (up to 200mm in 24 hours) in Wayanad, Idukki, and Kozhikode districts.", type: "Heavy Rainfall" }
];

function BackgroundEarth() {
  return (
    <div id="background_earth_canvas" className="absolute inset-0 overflow-hidden pointer-events-none z-0 flex items-center justify-center opacity-30 select-none">
      <div className="relative w-[340px] h-[340px] md:w-[480px] md:h-[480px] rounded-full overflow-hidden border border-sky-200/50 shadow-[inset_0_0_50px_rgba(56,189,248,0.35),_0_0_30px_rgba(186,230,253,0.15)] bg-sky-50 animate-pulse">
        {/* Atmospheric halo overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-sky-300/10 via-sky-400/20 to-sky-500/30 mix-blend-overlay rounded-full" />
        
        {/* Continents looping translation container */}
        <div className="absolute inset-0 w-[200%] h-full animate-rotate-globe flex">
          {/* Svg map repeat 1 */}
          <svg className="h-full w-1/2 fill-sky-400/30 stroke-sky-200/20" viewBox="0 0 1000 500" preserveAspectRatio="none">
            <path d="M150,150 Q180,120 200,160 T250,140 Q280,180 300,150 T380,160 Q400,220 350,260 T250,280 Q200,320 180,280 T150,220 Z" />
            <path d="M450,250 Q480,200 500,240 T550,220 Q580,270 600,230 T680,240 Q700,300 650,340 T550,360 Q500,400 480,360 T450,300 Z" />
            <path d="M750,100 Q780,80 800,110 T850,90 Q880,130 900,100 T980,110 Q1000,160 950,190 T850,210 Q800,250 780,210 T750,160 Z" />
            <path d="M50,300 Q80,280 100,310 T150,290 T200,310 Q180,350 120,360 Z" />
            <path d="M800,300 Q830,280 850,310 T900,290 T950,310 Q930,350 870,360 Z" />
          </svg>
          {/* Svg map repeat 2 (seamless loop duplicate) */}
          <svg className="h-full w-1/2 fill-sky-400/30 stroke-sky-200/20" viewBox="0 0 1000 500" preserveAspectRatio="none">
            <path d="M150,150 Q180,120 200,160 T250,140 Q280,180 300,150 T380,160 Q400,220 350,260 T250,280 Q200,320 180,280 T150,220 Z" />
            <path d="M450,250 Q480,200 500,240 T550,220 Q580,270 600,230 T680,240 Q700,300 650,340 T550,360 Q500,400 480,360 T450,300 Z" />
            <path d="M750,100 Q780,80 800,110 T850,90 Q880,130 900,100 T980,110 Q1000,160 950,190 T850,210 Q800,250 780,210 T750,160 Z" />
            <path d="M50,300 Q80,280 100,310 T150,290 T200,310 Q180,350 120,360 Z" />
            <path d="M800,300 Q830,280 850,310 T900,290 T950,310 Q930,350 870,360 Z" />
          </svg>
        </div>

        {/* Outer space orbital paths */}
        <div className="absolute inset-[-15px] rounded-full border border-sky-300/25 animate-spin-slow pointer-events-none" />
        <div className="absolute inset-[-35px] rounded-full border border-dashed border-amber-300/15 animate-spin-reverse pointer-events-none" />
      </div>
    </div>
  );
}

export default function App() {
  const [enteredPortal, setEnteredPortal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(true);
  const [userRole, setUserRole] = useState<'Admin' | 'Researcher' | 'Public User'>('Public User');

  // Security and notifications states
  const [loginModalRole, setLoginModalRole] = useState<'Admin' | 'Researcher' | null>(null);
  const [loginPasskey, setLoginPasskey] = useState('');
  const [loginError, setLoginError] = useState('');
  const [authenticatedRoles, setAuthenticatedRoles] = useState<Record<string, boolean>>({
    'Public User': true
  });
  const [showNotifications, setShowNotifications] = useState(false);

  const [states, setStates] = useState<StateClimate[]>(fallbackStates);
  const [selectedState, setSelectedState] = useState<StateClimate | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictClimate | null>(null);
  const [alerts, setAlerts] = useState<ClimateAlert[]>(fallbackAlerts);

  // Gemini assistant drawer states
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [chatPrompt, setChatPrompt] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'gemini', text: string }>>([
    { sender: 'gemini', text: "Namaste. I am the ISRO Climate Analyst, synced with INSAT satellite telemetry and IMD rainfall grids. Ask me anything about India's climate, scenario simulations, or comparative meteorological reports." }
  ]);
  const [isGeneratingChat, setIsGeneratingChat] = useState(false);

  // Load initial lists from backend Express APIs on mount
  useEffect(() => {
    const loadTelemetry = async () => {
      try {
        const stateRes = await fetch('/api/weather/state/maharashtra');
        if (stateRes.ok) {
          // Fetch states summary to feed InteractiveMap
          const statesSummaryRes = await fetch('/api/weather/states');
          const statesSummary = await statesSummaryRes.json();
          
          // Hydrate each state with full districts
          const hydrated = await Promise.all(statesSummary.map(async (s: any) => {
            const detailRes = await fetch(`/api/weather/state/${s.id}`);
            return await detailRes.json();
          }));
          setStates(hydrated);
        }

        const alertsRes = await fetch('/api/alerts');
        if (alertsRes.ok) {
          const alertsData = await alertsRes.json();
          setAlerts(alertsData);
        }
      } catch (err) {
        console.warn("Backend API offline or initial startup delayed, rendering local fallback templates.", err);
      }
    };

    loadTelemetry();
  }, []);

  // Set chat parameters and open side-drawer helper
  const handleOpenAssistantWithPrompt = (prompt?: string) => {
    setAssistantOpen(true);
    if (prompt) {
      setChatPrompt(prompt);
    }
  };

  // Submit prompt to Gemini Chat proxy in server.ts
  const handleSendPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatPrompt.trim() || isGeneratingChat) return;

    const userMsg = chatPrompt.trim();
    setChatPrompt('');
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setIsGeneratingChat(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMsg,
          context: selectedDistrict 
            ? { location: selectedDistrict.name, metrics: selectedDistrict.metrics }
            : selectedState 
              ? { location: selectedState.name, metrics: selectedState }
              : null
        })
      });

      if (response.ok) {
        const data = await response.json();
        setChatMessages(prev => [...prev, { sender: 'gemini', text: data.reply }]);
      } else {
        throw new Error();
      }
    } catch (err) {
      setChatMessages(prev => [...prev, { sender: 'gemini', text: "Scientific connection telemetry issue. I cannot access satellite grids right now. Please verify your GEMINI_API_KEY environment variable is declared in Secrets." }]);
    } finally {
      setIsGeneratingChat(false);
    }
  };

  const handleConfirmLogin = () => {
    if (!loginPasskey) {
      setLoginError('PLEASE ENTER KEY CARD PASSKEY');
      return;
    }
    const cleanKey = loginPasskey.trim();
    if (cleanKey === '1234' || cleanKey.toLowerCase() === loginModalRole?.toLowerCase()) {
      setUserRole(loginModalRole!);
      setAuthenticatedRoles(prev => ({ ...prev, [loginModalRole!]: true }));
      if (loginModalRole === 'Admin') {
        setActiveTab('admin');
      } else {
        setActiveTab('dashboard');
      }
      setEnteredPortal(true);
      setLoginModalRole(null);
      setLoginPasskey('');
      setLoginError('');
    } else {
      setLoginError('INVALID SECURITY SIGNATURE KEY');
    }
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            states={states}
            selectedState={selectedState}
            selectedDistrict={selectedDistrict}
            onSelectState={onSelectStateAndDrill}
            onSelectDistrict={setSelectedDistrict}
            alerts={alerts}
            onOpenAssistant={handleOpenAssistantWithPrompt}
          />
        );
      case 'map_explorer':
        return (
          <MapExplorerView
            states={states}
            selectedState={selectedState}
            onSelectState={onSelectStateAndDrill}
          />
        );
      case 'climate_overview':
        return (
          <ClimateOverviewView
            states={states}
            selectedState={selectedState}
            selectedDistrict={selectedDistrict}
          />
        );
      case 'ai_predictions':
        return (
          <AIPredictionsView
            states={states}
            selectedState={selectedState}
            selectedDistrict={selectedDistrict}
          />
        );
      case 'what_if':
        return <WhatIfSimulationView />;
      case 'risk_assessment':
        return (
          <RiskAssessmentView
            states={states}
            selectedState={selectedState}
            selectedDistrict={selectedDistrict}
          />
        );
      case 'reports':
        return (
          <ReportsView
            states={states}
            selectedState={selectedState}
            selectedDistrict={selectedDistrict}
          />
        );
      case 'admin':
        return <AdminPanelView />;
      case 'alerts':
        return (
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h2 className="text-lg font-bold font-display text-slate-800">National Climate Alert Ledger</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {alerts.map((alt) => (
                <div key={alt.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-start gap-3">
                  <div className={`h-3 w-3 rounded-full mt-1 shrink-0 ${alt.severity === 'High' ? 'bg-red-500' : 'bg-amber-400'}`} />
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs font-display">{alt.title}</h4>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">Valid until: {alt.validUntil}</p>
                    <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">{alt.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return <div>Active View: {activeTab}</div>;
    }
  };

  function onSelectStateAndDrill(st: StateClimate | null) {
    setSelectedState(st);
    if (!st) {
      setSelectedDistrict(null);
    } else {
      setSelectedDistrict(st.districts[0] || null);
    }
  }
  // RENDER SELECTION: LANDING OR DASHBOARD PORTAL
  if (!enteredPortal) {
    return (
      <div className="min-h-screen relative flex flex-col justify-between overflow-hidden bg-[#020308] text-slate-100 font-sans p-6 select-none pb-12 custom-cursor-active">
        <CustomCursor />
        
        {/* Immersive 3D Starfield & Rotating/Revolving Celestial Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          
          {/* Extremely fine, high-density twinkling starfield */}
          {Array.from({ length: 80 }).map((_, i) => {
            const size = (i % 3) === 0 ? 1 : 1.5; // fine micro stars
            const delay = (i * 0.11).toFixed(2);
            const duration = (3.0 + (i % 4) * 0.9).toFixed(2);
            const x = (Math.sin(i * 157.4) * 50 + 50).toFixed(2);
            const y = (Math.cos(i * 613.8) * 50 + 50).toFixed(2);
            return (
              <div
                key={i}
                className="absolute bg-white rounded-full star-twinkle"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${x}%`,
                  top: `${y}%`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                  opacity: size === 1 ? 0.25 : 0.65,
                }}
              />
            );
          })}

          {/* Diagonally crossing, delicate shooting stars exactly from the mockup */}
          <div className="shooting-star" style={{ top: '20%', left: '30%', animationDelay: '0s', animationDuration: '7s' }} />
          <div className="shooting-star" style={{ top: '65%', left: '10%', animationDelay: '3.5s', animationDuration: '9s' }} />
          <div className="shooting-star" style={{ top: '45%', left: '70%', animationDelay: '5s', animationDuration: '8s' }} />

          {/* Planetary rise soft crimson/orange glow at the bottom-center exactly matching the reference */}
          <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[70%] h-[40%] bg-gradient-to-t from-[#ff4500]/12 via-[#ff4500]/4 to-transparent rounded-full filter blur-[120px] pointer-events-none z-0"></div>
          <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[40%] h-[25%] bg-gradient-to-t from-orange-600/8 to-transparent rounded-full filter blur-[80px] pointer-events-none z-0"></div>
        </div>

        {/* 1. Header Navigation - Extremely clean and non-intrusive */}
        <header className="w-full max-w-5xl mx-auto flex justify-between items-center py-4 z-10 shrink-0">
          <div className="flex items-center gap-2">
            <IsroLogo size={30} />
            <div>
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-xs tracking-wider font-display text-white">ISRO</span>
                <span className="text-[7px] font-bold bg-isro-yellow text-slate-950 px-0.8 py-0.1 rounded font-mono uppercase">TWIN</span>
              </div>
              <p className="text-[7px] text-slate-400 font-mono tracking-wider font-semibold">CLIMATE INTEL</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setEnteredPortal(true)}
              className="px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-[9px] font-bold tracking-widest rounded-full text-white transition uppercase font-mono cursor-pointer"
            >
              Control Panel
            </button>
          </div>
        </header>

        {/* 2. Hero Section with the giant "space" Typographic Logo matching the screenshot */}
        <main className="w-full max-w-3xl mx-auto flex-1 flex flex-col items-center justify-center text-center z-10 py-6">
          
          {/* Centered giant typographic logo representing "digital climate twinner" stacked */}
          <div className="flex flex-col items-center justify-center font-sans select-none tracking-tight mb-4 select-none gap-0 leading-none">
            {/* Row 1: digital */}
            <span 
              className="text-[48px] sm:text-[70px] md:text-[95px] font-black text-white leading-none tracking-tighter"
              style={{
                textShadow: '1px 1px 0px #e2e8f0, 2px 2px 0px #cbd5e1, 3px 3px 0px #94a3b8, 4px 4px 0px #64748b, 6px 6px 15px rgba(0, 0, 0, 0.9)',
                letterSpacing: '-0.06em'
              }}
            >
              digital
            </span>
            
            {/* Row 2: climate with glowing orange 'a' */}
            <div className="flex items-center justify-center leading-none -mt-1.5 sm:-mt-3">
              <span 
                className="text-[48px] sm:text-[70px] md:text-[95px] font-black text-white leading-none tracking-tighter"
                style={{
                  textShadow: '1px 1px 0px #e2e8f0, 2px 2px 0px #cbd5e1, 3px 3px 0px #94a3b8, 4px 4px 0px #64748b, 6px 6px 15px rgba(0, 0, 0, 0.9)',
                  letterSpacing: '-0.06em'
                }}
              >
                clim
              </span>
              
              {/* Glowing neon loop representing 'a' */}
              <div className="relative flex items-center justify-center -ml-0.5 sm:-ml-1 mr-0.5 sm:mr-1">
                {/* Glowing Orange/Red Loop */}
                <div 
                  className="w-[42px] sm:w-[60px] md:w-[82px] h-[21px] sm:h-[30px] md:h-[40px] rounded-[10.5px] sm:rounded-[15px] md:rounded-[20px] border-[3px] sm:border-[4.5px] md:border-[6px] border-[#ff4105] bg-gradient-to-r from-orange-600/10 via-red-600/20 to-orange-500/10 relative"
                  style={{
                    boxShadow: '0 0 28px rgba(255, 65, 5, 1), inset 0 0 12px rgba(255, 65, 5, 0.7)',
                    filter: 'drop-shadow(0 0 7px rgba(255, 65, 5, 0.85))',
                  }}
                >
                  {/* Internal flicker/shimmer animation background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/15 via-red-500/30 to-orange-600/15 rounded-full filter blur-[1px] animate-pulse" />
                </div>
                
                {/* White/Silver vertical 3D stem of 'a' on the right */}
                <div 
                  className="absolute right-0 bottom-0 w-[6px] sm:w-[9px] md:w-[12px] h-[27px] sm:h-[38px] md:h-[51px] bg-gradient-to-b from-[#ffffff] via-[#e2e8f0] to-[#cbd5e1] rounded-r-[2px] sm:rounded-r-[3px] md:rounded-r-[4px]"
                  style={{
                    boxShadow: '1px 1px 0px #cbd5e1, 2px 2px 0px #94a3b8, 3px 3px 0px #64748b, 4px 4px 12px rgba(0, 0, 0, 0.9)',
                    transform: 'translateX(1.5px)',
                  }}
                />
              </div>

              <span 
                className="text-[48px] sm:text-[70px] md:text-[95px] font-black text-white leading-none tracking-tighter -ml-0.5 sm:-ml-1"
                style={{
                  textShadow: '1px 1px 0px #e2e8f0, 2px 2px 0px #cbd5e1, 3px 3px 0px #94a3b8, 4px 4px 0px #64748b, 6px 6px 15px rgba(0, 0, 0, 0.9)',
                  letterSpacing: '-0.06em'
                }}
              >
                te
              </span>
            </div>

            {/* Row 3: twinner */}
            <span 
              className="text-[48px] sm:text-[70px] md:text-[95px] font-black text-white leading-none tracking-tighter -mt-1.5 sm:-mt-3"
              style={{
                textShadow: '1px 1px 0px #e2e8f0, 2px 2px 0px #cbd5e1, 3px 3px 0px #94a3b8, 4px 4px 0px #64748b, 6px 6px 15px rgba(0, 0, 0, 0.9)',
                letterSpacing: '-0.06em'
              }}
            >
              twinner
            </span>
          </div>

          {/* Subtitle text exactly styled like "The #1 Gamified NFT Marketplace with 100% Revenue Sharing" */}
          <p className="text-[#f1f5f9] font-sans font-medium text-xs sm:text-sm md:text-base tracking-wide max-w-2xl mx-auto leading-relaxed px-4 opacity-95">
            The #1 Space Telemetry and Climate Intelligence Platform with 100% Data Synchronicity
          </p>

          {/* Center sleek capsule buttons to transition into full experience or talk with Gemini */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 w-full px-4">
            <button
              onClick={() => {
                setUserRole('Public User');
                setEnteredPortal(true);
              }}
              className="px-8 py-3 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold text-xs tracking-widest rounded-full transition-all duration-300 cursor-pointer shadow-[0_0_25px_rgba(249,115,22,0.4)] hover:shadow-[0_0_35px_rgba(249,115,22,0.7)] uppercase border border-orange-500/25"
            >
              Enter Experience
            </button>
            
            <button
              onClick={() => handleOpenAssistantWithPrompt("Explain the core climate telemetry analysis metrics available in this twin.")}
              className="px-6 py-3 bg-black/40 hover:bg-white/5 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white font-semibold text-xs tracking-widest rounded-full transition-all duration-200 cursor-pointer"
            >
              Ask Gemini AI
            </button>
          </div>

          {/* Secure Portal Access Credentials Row */}
          <div className="flex items-center justify-center gap-4 mt-6 text-slate-400 text-[10px] font-mono">
            <span className="opacity-50">GATEWAY AUTHORIZATION:</span>
            <button
              onClick={() => setLoginModalRole('Admin')}
              className="text-orange-400 hover:text-orange-300 hover:underline font-bold transition uppercase cursor-pointer bg-transparent border-none"
            >
              [Admin Login]
            </button>
            <span className="opacity-30">|</span>
            <button
              onClick={() => setLoginModalRole('Researcher')}
              className="text-sky-400 hover:text-sky-300 hover:underline font-bold transition uppercase cursor-pointer bg-transparent border-none"
            >
              [Researcher Login]
            </button>
          </div>

        </main>

        {/* 3. Footer */}
        <footer className="w-full max-w-5xl mx-auto py-4 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-slate-500 text-[9px] font-mono tracking-wider gap-2 shrink-0 z-10">
          <span>COPERNICUS_GRID: SYNCHRONIZED</span>
          <span>Developed by Harsh, Naiya and Khush</span>
          <span>© 2026 ISRO Indian Space Program. All rights reserved.</span>
        </footer>

        {/* Floating Gemini Chat Drawer during landing */}
        {assistantOpen && renderAssistantDrawer()}

      </div>
    );
  }

  // FULL WORKSPACE RENDER ON PORTAL ACTIVE
  return (
    <div className={`flex h-screen overflow-hidden relative ${darkMode ? 'dark custom-cursor-active' : ''}`}>
      {darkMode && <CustomCursor />}
      
      {/* 1. Left Navigation Sidebar Backdrop Overlay on Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[190] md:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 2. Left Navigation Sidebar with slide-out animation on Mobile */}
      <div className={`fixed inset-y-0 left-0 z-[200] transform md:relative md:translate-x-0 transition-transform duration-300 ease-in-out flex shrink-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setIsSidebarOpen(false); // Auto-close sidebar on mobile after selection
          }}
          onOpenAssistant={() => handleOpenAssistantWithPrompt()}
          userRole={userRole}
          onClose={() => setIsSidebarOpen(false)}
          onBackToLanding={() => setEnteredPortal(false)}
        />
      </div>

      {/* 3. Central Workspace Console Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-hidden relative">
        
        {/* Top bar header */}
        <header className="relative px-3 py-1.5 bg-white border-b border-slate-100 flex items-center justify-between gap-2 shadow-sm shrink-0 z-[100]">
          
          <div className="flex items-center gap-1.5 min-w-0">
            {/* Hamburger Menu Button visible only on Mobile */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 hover:text-slate-900 transition shrink-0"
              title="Open Navigation Menu"
            >
              <Menu size={18} />
            </button>

            {/* State / District selector widget */}
            <div className="flex items-center gap-1 min-w-0">
              <div className="bg-isro-blue/10 p-1 rounded text-isro-blue shrink-0 hidden sm:block">
                <Compass size={13} />
              </div>
              <div className="min-w-0">
                <span className="text-[7px] text-slate-400 font-bold block uppercase tracking-wider font-mono leading-none">Telemetry Node</span>
                <div className="flex items-center gap-0.5 text-[10px] md:text-[11px] font-bold text-slate-800 leading-tight truncate">
                  <span className="truncate max-w-[90px] xs:max-w-[120px] sm:max-w-none">{selectedDistrict ? `${selectedDistrict.name}, ${selectedState?.name}` : selectedState ? selectedState.name : 'All India'}</span>
                  {selectedState && (
                    <button 
                      onClick={() => onSelectStateAndDrill(null)}
                      className="text-[8px] text-red-500 font-bold hover:underline shrink-0"
                    >
                      (CLR)
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* User profile container */}
          <div className="flex items-center gap-1.5 relative">

            {/* Notification system */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-1 text-slate-500 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white border border-slate-200 dark:border-slate-800 rounded relative hover:bg-slate-50 dark:hover:bg-slate-900/60 transition shrink-0 cursor-pointer"
              >
                <Bell size={12} />
                <span className="absolute top-0.5 right-0.5 h-1.5 w-1.5 rounded-full bg-isro-yellow ring-1 ring-white animate-pulse"></span>
              </button>

              {/* Notification Dropdown Portal */}
              {showNotifications && (
                <div className="absolute right-0 top-8 w-72 bg-white dark:bg-[#060a17] border border-slate-200 dark:border-orange-500/40 rounded-xl shadow-2xl p-3 z-[999] animate-fade-in font-sans">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5 mb-1.5">
                    <span className="text-[10px] font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1 font-display">
                      <Bell size={12} className="text-isro-yellow animate-bounce-slow" />
                      Live Satellite Alerts ({alerts.length})
                    </span>
                    <button 
                      onClick={() => { setAlerts([]); setShowNotifications(false); }}
                      className="text-[8px] text-red-500 font-bold hover:underline font-mono cursor-pointer"
                    >
                      CLEAR
                    </button>
                  </div>
                  <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1 scrollbar-thin">
                    {alerts.length > 0 ? (
                      alerts.map((alt) => (
                        <div key={alt.id} className="p-1.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 rounded-lg space-y-0.5 text-left leading-tight">
                          <div className="flex items-center justify-between">
                            <span className={`text-[8px] font-bold px-1.5 py-0.1 rounded font-mono ${
                              alt.severity === 'High' ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-amber-50 text-amber-500 border border-amber-100'
                            }`}>
                              {alt.severity.toUpperCase()}
                            </span>
                          </div>
                          <h5 className="font-bold text-slate-800 dark:text-slate-100 text-[9px] font-display">{alt.title}</h5>
                          <p className="text-[8px] text-slate-500 dark:text-slate-400 leading-normal font-mono">{alt.description}</p>
                        </div>
                      ))
                    ) : (
                      <div className="py-4 text-center text-slate-400 text-[9px] font-mono">
                        No active alerts. All grids stable.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Active profile avatar button */}
            <div className="flex items-center gap-1 pl-1 border-l border-slate-200 shrink-0">
              <div className="h-6 w-6 rounded-full bg-isro-blue text-white font-bold flex items-center justify-center text-[9px] shadow shrink-0">
                <User size={11} />
              </div>
              <div className="hidden lg:block text-left text-[10px] leading-tight">
                <span className="font-semibold block text-slate-800">
                  {userRole === 'Admin' ? 'Dr. K. Sivan' : userRole === 'Researcher' ? 'Dr. Naiya' : 'Guest Visitor'}
                </span>
                <span className="text-[8px] text-slate-400 block font-mono leading-none">{userRole}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Central visual window with proper scroll margins */}
        <div className="flex-1 overflow-y-auto p-3 scrollbar-thin relative">
          {/* Beautiful spinning 3D Earth backdrop behind active workspace components */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-45">
            <BackgroundEarth />
          </div>
          <div className="relative z-10 space-y-3">
            {renderActiveView()}
          </div>
        </div>

        {/* Console Footing */}
        <footer className="px-6 py-1.5 bg-white border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center text-[9px] text-slate-400 font-mono gap-1 shrink-0">
          <span>Developed by: Naiya, Khush &amp; Harsh</span>
          <span>COPERNICUS_SECURE: ON | NODE_RUN_3000</span>
          <span>© 2026 ISRO Indian Space Program. All rights reserved.</span>
        </footer>
      </div>

      {/* 3. Floating Gemini Assistant Right Drawer */}
      {assistantOpen && renderAssistantDrawer()}

      {/* Security passkey authorization popup dialog */}
      {loginModalRole && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center z-[250] animate-fade-in font-sans text-slate-100">
          <div className="bg-[#0c1020] rounded-2xl border border-orange-500/30 p-6 max-w-sm w-full space-y-4 shadow-[0_0_50px_rgba(249,115,22,0.15)] relative text-left">
            <button 
              onClick={() => { setLoginModalRole(null); setLoginError(''); setLoginPasskey(''); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X size={18} />
            </button>
            
            <div className="text-center space-y-2">
              <div className="mx-auto h-12 w-12 bg-orange-500/10 rounded-full flex items-center justify-center text-orange-500 border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
                <Lock size={20} className="animate-pulse" />
              </div>
              <h3 className="text-base font-bold font-display text-white">ISRO Auth Elevation Node</h3>
              <p className="text-[11px] text-slate-300 leading-normal font-mono">
                Enter key card credentials to authorize elevation to <span className="font-bold text-orange-400 uppercase">[{loginModalRole}]</span>.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Authorization Key</label>
              <input 
                type="password"
                placeholder="Default bypass key: 1234"
                value={loginPasskey}
                onChange={(e) => setLoginPasskey(e.target.value)}
                className="w-full bg-[#050814] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-center font-mono text-white focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/40"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleConfirmLogin();
                }}
                autoFocus
              />
              {loginError && (
                <p className="text-[10px] text-red-500 font-bold text-center font-mono mt-1">{loginError}</p>
              )}
            </div>

            <div className="flex gap-2.5 pt-1">
              <button 
                onClick={() => { setLoginModalRole(null); setLoginError(''); setLoginPasskey(''); }}
                className="flex-1 bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200"
              >
                Back
              </button>
              <button 
                onClick={handleConfirmLogin}
                className="flex-1 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white py-2 rounded-xl text-xs font-bold cursor-pointer transition-all duration-200 shadow-[0_0_15px_rgba(249,115,22,0.2)]"
              >
                Authorize
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );

  // Floating Gemini Chat Drawer Builder
  function renderAssistantDrawer() {
    return (
      <div className="fixed inset-y-0 right-0 w-full sm:w-96 max-w-full bg-white shadow-2xl z-50 flex flex-col justify-between border-l border-slate-200 font-sans transform transition duration-300">
        
        {/* Drawer header */}
        <div className="p-4 bg-isro-blue text-white flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="bg-isro-yellow p-1.5 rounded-lg text-slate-950">
              <Sparkles size={16} className="animate-spin-slow" />
            </div>
            <div>
              <span className="text-xs font-bold block font-display">Generative Climatologist</span>
              <span className="text-[9px] font-mono text-isro-light-blue uppercase tracking-widest font-semibold">Gemini API active</span>
            </div>
          </div>
          <button 
            onClick={() => setAssistantOpen(false)}
            className="text-white hover:bg-white/10 p-1.5 rounded-lg transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Messages space */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50 scrollbar-thin">
          {chatMessages.map((msg, idx) => {
            const isMe = msg.sender === 'user';
            return (
              <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed font-mono ${
                  isMe
                    ? 'bg-isro-blue text-white rounded-br-none shadow-sm'
                    : 'bg-white text-slate-850 rounded-bl-none border border-slate-200 shadow-sm'
                }`}>
                  {msg.text.split('\n').map((line, idx) => (
                    <p key={idx} className={line.startsWith('#') ? 'font-bold font-display text-xs text-isro-blue mt-1.5 first:mt-0' : 'mb-1 last:mb-0'}>
                      {line}
                    </p>
                  ))}
                </div>
                <span className="text-[8px] text-slate-400 font-mono mt-1 px-1">{isMe ? 'You' : 'Gemini AI'}</span>
              </div>
            );
          })}

          {isGeneratingChat && (
            <div className="flex items-start gap-2 text-slate-400 font-mono text-[10px] animate-pulse">
              <Loader size={12} className="animate-spin text-isro-blue" />
              <span>Gemini is compiling meteorological report indices...</span>
            </div>
          )}
        </div>

        {/* Input prompt drawer */}
        <form onSubmit={handleSendPrompt} className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
          <input
            type="text"
            required
            placeholder="e.g. Compare Delhi and Mumbai climate..."
            value={chatPrompt}
            onChange={(e) => setChatPrompt(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-isro-blue/20 font-mono"
          />
          <button
            type="submit"
            disabled={isGeneratingChat || !chatPrompt.trim()}
            className="p-2 bg-isro-blue text-white hover:bg-blue-800 rounded-xl disabled:opacity-50 transition cursor-pointer"
          >
            <Send size={15} />
          </button>
        </form>

      </div>
    );
  }
}
