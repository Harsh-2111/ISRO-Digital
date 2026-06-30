import React from 'react';
import {
  LayoutDashboard,
  Map,
  TrendingUp,
  BrainCircuit,
  Sliders,
  AlertTriangle,
  FileText,
  Bell,
  Database,
  Compass,
  MessageCircle,
  HelpCircle,
  Cpu,
  X,
  ArrowLeft
} from 'lucide-react';
import { IsroLogo } from './IsroLogo';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAssistant: () => void;
  userRole: 'Admin' | 'Researcher' | 'Public User';
  onClose?: () => void;
  onBackToLanding?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAssistant,
  userRole,
  onClose,
  onBackToLanding
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'map_explorer', label: 'Map Explorer', icon: Map },
    { id: 'climate_overview', label: 'Climate Overview', icon: TrendingUp },
    { id: 'ai_predictions', label: 'AI Predictions', icon: BrainCircuit },
    { id: 'what_if', label: 'What-If Simulation', icon: Sliders },
    { id: 'risk_assessment', label: 'Risk Assessment', icon: AlertTriangle },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'alerts', label: 'Alerts Hub', icon: Bell },
  ];

  // Admin access items
  const adminItems = [
    { id: 'admin', label: 'Admin Panel', icon: Database }
  ];

  return (
    <div id="sidebar_container" className="w-56 bg-white/80 backdrop-blur-lg text-slate-800 dark:text-slate-100 flex flex-col justify-between h-screen shrink-0 shadow-sm overflow-hidden relative border-r border-slate-200/80 dark:border-slate-800/80">
      
      {/* Top Section - Brand and Title */}
      <div>
        <div className="p-3.5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            {/* Logo element representing space satellite / earth */}
            <div className="h-9 w-9 flex items-center justify-center shrink-0">
              <IsroLogo size={36} />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-sm tracking-wider font-display text-slate-900 dark:text-white leading-none">ISRO</span>
                <span className="text-[8px] font-bold bg-isro-yellow text-slate-950 px-1 py-0.2 rounded font-mono uppercase leading-none">TWIN</span>
              </div>
              <p className="text-[8px] text-slate-500 dark:text-slate-400 font-mono tracking-wider font-semibold leading-none mt-1">CLIMATE INTEL</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded transition"
              title="Close Sidebar"
            >
              <X size={16} />
            </button>
          )}
        </div>
 
        {/* Navigation Items */}
        <div className="p-2 px-3 space-y-0.5 overflow-y-auto max-h-[calc(100vh-250px)] animate-fade-in">
          
          {onBackToLanding && (
            <button
              onClick={onBackToLanding}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 mb-3 rounded-lg text-xs font-bold text-sky-600 hover:text-sky-800 bg-sky-50 hover:bg-sky-100/80 dark:bg-orange-500/10 dark:hover:bg-orange-500/20 dark:text-orange-400 transition shadow-sm border border-sky-100/50 dark:border-orange-500/20"
            >
              <ArrowLeft size={13} className="shrink-0 dark:text-orange-400" />
              <span>Back to Main Screen</span>
            </button>
          )}

          <p className="text-[8px] text-slate-400 dark:text-slate-500 font-mono font-bold tracking-widest uppercase pl-2 mb-1.5">CLIMATE TWIN GATEWAY</p>
          
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition duration-100 cursor-pointer ${
                  isActive
                    ? 'bg-sky-50 dark:bg-orange-500/10 text-sky-600 dark:text-orange-400 font-semibold shadow-sm border-r-2 border-sky-500 dark:border-orange-500'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-sky-600 dark:text-orange-400 shrink-0' : 'text-slate-400 dark:text-slate-500 shrink-0'} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
 
          {/* Admin Block (Visible to Admin and Researcher roles) */}
          {(userRole === 'Admin' || userRole === 'Researcher') && (
            <div className="pt-2.5 mt-2.5 border-t border-slate-200 dark:border-slate-800/80">
              <p className="text-[8px] text-slate-400 dark:text-slate-500 font-mono font-bold tracking-widest uppercase pl-2 mb-1.5">RESEARCH & SECURITY</p>
              {adminItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition duration-100 cursor-pointer ${
                      isActive
                        ? 'bg-sky-50 dark:bg-orange-500/10 text-sky-600 dark:text-orange-400 font-semibold shadow-sm border-r-2 border-sky-500 dark:border-orange-500'
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/60 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon size={14} className={isActive ? 'text-sky-600 dark:text-orange-400 shrink-0' : 'text-slate-400 dark:text-slate-500 shrink-0'} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
 
      {/* Bottom Generative AI assistant widget matching mockup illustration */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40">
        <div className="bg-sky-50/60 dark:bg-slate-950/80 rounded-xl p-2.5 border border-sky-100 dark:border-orange-500/20 relative overflow-hidden group">
          <div className="absolute -top-6 -right-6 w-12 h-12 bg-sky-500/10 dark:bg-orange-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
          
          <div className="flex items-center gap-1.5 mb-1">
            <div className="bg-sky-500 dark:bg-orange-600 p-1 rounded">
              <Cpu size={11} className="text-white animate-pulse" />
            </div>
            <span className="text-[11px] font-bold font-display text-slate-800 dark:text-slate-100">Climate Assistant</span>
          </div>
          
          <p className="text-[9px] text-slate-500 dark:text-slate-400 mb-2 leading-tight font-mono">
            Ask Gemini regarding simulations or comparative meteorological vectors.
          </p>
          
          <button
            onClick={onOpenAssistant}
            className="w-full bg-isro-blue dark:bg-gradient-to-r dark:from-orange-600 dark:to-amber-500 text-white font-bold py-1.5 rounded-lg text-[10px] flex items-center justify-center gap-1 hover:bg-blue-800 dark:hover:from-orange-500 dark:hover:to-amber-400 transition cursor-pointer shadow-sm shadow-orange-500/10"
          >
            <MessageCircle size={11} />
            Ask Gemini AI
          </button>
        </div>
        
        {/* Footer info in sidebar */}
        <div className="mt-2 flex justify-between items-center px-0.5 text-[8px] text-slate-400 dark:text-slate-500 font-mono">
          <span>COPERNICUS_GRID: ON</span>
          <span>v2.4.0 (Live)</span>
        </div>
      </div>

    </div>
  );
};
