'use client';

if (typeof window !== 'undefined' && typeof String.prototype.repeat === 'function') {
    const originalRepeat = String.prototype.repeat;
    String.prototype.repeat = function (count: number) {
        if (count < 0) {
            console.error('Trapped negative repeat:', count, this);
            const errDiv = document.createElement('div');
            errDiv.style.position = 'fixed';
            errDiv.style.top = '0';
            errDiv.style.left = '0';
            errDiv.style.width = '100VW';
            errDiv.style.height = '100VH';
            errDiv.style.background = 'rgba(255, 0, 0, 0.9)';
            errDiv.style.color = 'white';
            errDiv.style.zIndex = '99999';
            errDiv.style.padding = '20px';
            errDiv.style.overflow = 'auto';
            errDiv.style.whiteSpace = 'pre-wrap';
            errDiv.style.fontFamily = 'monospace';

            const stack = new Error().stack;
            errDiv.innerText = `Trapped negative repeat! Count: ${count}\nString: "${this}"\n\nStack Trace:\n${stack}`;

            document.body.appendChild(errDiv);
            // We return a safe value to maybe let the app limp along to show the error
            return originalRepeat.call(this, 0);
        }
        return originalRepeat.call(this, count);
    };
}

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import SidebarLeft from '../components/SidebarLeft';
import SidebarRight from '../components/SidebarRight';
import { MOCK_REGIONS, SimulationSettings } from '../lib/data';
import { calculateRisk } from '../lib/engine';
import { Globe, ShieldCheck, Map as MapIcon, BarChart3 } from 'lucide-react';

// Dynamic import for MapExplorer to avoid SSR issues with Leaflet
const MapExplorer = dynamic(() => import('../components/MapExplorer'), {
    ssr: false,
    loading: () => (
        <div className="h-full w-full bg-zinc-100 animate-pulse flex items-center justify-center rounded-lg border border-zinc-200">
            <div className="text-zinc-400 flex flex-col items-center gap-2">
                <MapIcon className="w-8 h-8" />
                <span className="text-sm font-medium">Initializing Geospatial Engine...</span>
            </div>
        </div>
    ),
});

export default function Home() {
    const [selectedRegion, setSelectedRegion] = useState(MOCK_REGIONS[0]);
    const [settings, setSettings] = useState<SimulationSettings>({
        weatherSeverity: 0,
        userLoad: 1,
        infraFailure: false,
        showHeatmap: false,
    });

    const analysis = useMemo(() => {
        return calculateRisk(selectedRegion, settings);
    }, [selectedRegion, settings]);

    return (
        <div
            className="flex flex-col h-screen bg-zinc-50 font-sans text-zinc-900 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/28ajit-pawar.webp')" }}
        >
            {/* Header */}
            <header className="h-16 border-b border-zinc-200 bg-white px-6 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
                        <Globe className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-sm font-bold tracking-tight">SDG 9.11 Resilience Platform</h1>
                        <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest">Rural Broadband Planning & Risk Analysis</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 px-3 py-1 bg-zinc-100 rounded-full border border-zinc-200">
                        <ShieldCheck className="w-4 h-4 text-green-600" />
                        <span className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Simulated Dataset V1.0</span>
                    </div>
                    <div className="h-4 w-px bg-zinc-200" />
                    <div className="flex items-center gap-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                        <span className="hover:text-zinc-900 cursor-pointer transition-colors">Documentation</span>
                        <span className="hover:text-zinc-900 cursor-pointer transition-colors">Datasets</span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex overflow-hidden p-6 gap-6">
                {/* Left Control Panel */}
                <SidebarLeft
                    selectedRegion={selectedRegion}
                    onRegionChange={setSelectedRegion}
                    settings={settings}
                    onSettingsChange={setSettings}
                />

                {/* Center Map View */}
                <div className="flex-1 flex flex-col gap-4">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-2">
                            <MapIcon className="w-4 h-4 text-zinc-400" />
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Active Analysis Scope: {selectedRegion.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                <span className="text-[10px] font-bold text-zinc-400 uppercase">Live Simulation</span>
                            </div>
                        </div>
                    </div>
                    <MapExplorer region={selectedRegion} analysis={analysis} settings={settings} />
                </div>

                {/* Right Metrics Panel */}
                <SidebarRight analysis={analysis} region={selectedRegion} />
            </main>

            {/* Footer / Status Bar */}
            <footer className="h-10 border-t border-zinc-200 bg-white px-6 flex items-center justify-between shrink-0 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                <div className="flex items-center gap-6">
                    <span className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        System Ready
                    </span>
                    <span>Engine: Resilience-V2</span>
                </div>
                <div className="flex items-center gap-4">
                    <span>Lat: {selectedRegion.center[0].toFixed(4)}</span>
                    <span>Lng: {selectedRegion.center[1].toFixed(4)}</span>
                </div>
            </footer>
        </div>
    );
}
