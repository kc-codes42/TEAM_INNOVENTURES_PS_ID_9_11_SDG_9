'use client';

import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Region, RiskAnalysis } from '../lib/data';
import { useEffect } from 'react';

// Reset Default Icons
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapExplorerProps {
    region: Region;
    analysis: RiskAnalysis;
}

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

export default function MapExplorer({ region, analysis }: MapExplorerProps) {

    const getRiskColor = (score: number) => {
        if (score > 75) return '#ef4444';
        if (score > 45) return '#f59e0b';
        return '#22c55e';
    };

    const riskColor = getRiskColor(analysis.score);

    return (
        <div className="relative w-full h-full rounded-xl overflow-hidden border border-border shadow-sm bg-muted/30">
            <MapContainer
                center={region.center}
                zoom={region.zoom}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ChangeView center={region.center} zoom={region.zoom} />

                {/* Heatmap Overlay (Mocked based on risk) */}
                <Circle
                    center={region.center}
                    radius={4000}
                    pathOptions={{
                        fillColor: riskColor,
                        color: riskColor,
                        weight: 1,
                        fillOpacity: 0.2
                    }}
                />

                {/* Villages */}
                {region.villages.map(v => (
                    <Marker key={v.id} position={v.coords}>
                        <Popup>
                            <div className="p-1">
                                <strong className="block text-sm text-foreground">{v.name}</strong>
                                <span className="text-xs text-muted-foreground">Pop: {v.population}</span>
                            </div>
                        </Popup>
                    </Marker>
                ))}

            </MapContainer>

            {/* Overlay Legend */}
            <div className="absolute bottom-4 right-4 z-[999] bg-popover/95 backdrop-blur px-3 py-2 rounded-lg border border-border shadow-sm text-xs text-popover-foreground">
                <div className="font-bold mb-1 text-muted-foreground uppercase tracking-wider">Risk Zones</div>
                <div className="space-y-1">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500" /> Stable</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500" /> At-Risk</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500" /> Critical</div>
                </div>
            </div>
        </div>
    );
}
