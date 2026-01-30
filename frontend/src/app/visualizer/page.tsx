'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { motion, useMotionValue, useMotionValueEvent, useSpring } from 'framer-motion';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CloudRain,
  Gauge,
  LayoutDashboard,
  LogOut,
  Radar,
  Settings,
  Satellite,
  SignalHigh,
  UserCircle2,
} from 'lucide-react';

type Village = {
  id: string;
  name: string;
  position: [number, number];
  baseScore: number;
  terrain: number[];
};

const villages: Village[] = [
  {
    id: 'v-1',
    name: 'Basantpur',
    position: [28.6139, 77.209],
    baseScore: 86,
    terrain: [14, 22, 18, 28, 24, 30, 26, 34, 29],
  },
  {
    id: 'v-2',
    name: 'Kalyanpur',
    position: [27.1767, 78.0081],
    baseScore: 52,
    terrain: [8, 12, 15, 11, 18, 14, 10, 16, 13],
  },
  {
    id: 'v-3',
    name: 'Shantinagar',
    position: [26.8467, 80.9462],
    baseScore: 74,
    terrain: [10, 16, 14, 19, 21, 20, 23, 18, 24],
  },
  {
    id: 'v-4',
    name: 'Haripura',
    position: [25.3176, 82.9739],
    baseScore: 61,
    terrain: [6, 9, 12, 10, 14, 15, 13, 17, 16],
  },
];

const mapCenter: [number, number] = [27.4, 78.6];

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const motionValue = useMotionValue(value);
  const spring = useSpring(motionValue, { stiffness: 120, damping: 20 });
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    motionValue.set(value);
  }, [motionValue, value]);

  useMotionValueEvent(spring, 'change', (latest) => {
    setDisplay(Math.round(latest));
  });

  return (
    <span>
      {display}
      {suffix}
    </span>
  );
}

function HealthGauge({ value }: { value: number }) {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg width="120" height="120" className="-rotate-90">
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="rgba(148, 163, 184, 0.2)"
          strokeWidth="10"
          fill="transparent"
        />
        <motion.circle
          cx="60"
          cy="60"
          r={radius}
          stroke="url(#gaugeGradient)"
          strokeWidth="10"
          fill="transparent"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8 }}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="gaugeGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        <div className="text-2xl font-semibold text-white">
          <AnimatedNumber value={value} suffix="%" />
        </div>
        <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Score</div>
      </div>
    </div>
  );
}

function TerrainChart({ points, congestion }: { points: number[]; congestion: boolean }) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const normalized = points.map((p) => ((p - min) / (max - min || 1)) * 70 + 10);
  const poly = normalized.map((y, index) => `${index * 26},${90 - y}`).join(' ');

  return (
    <div className="relative">
      <svg viewBox="0 0 220 100" className="h-24 w-full">
        <polyline
          fill="none"
          stroke="#38bdf8"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={poly}
        />
      </svg>
      {congestion && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl border border-amber-400/30 bg-amber-400/10 text-xs font-semibold uppercase text-amber-300">
          High Latency Detected
        </div>
      )}
    </div>
  );
}

function ToggleSwitch({
  checked,
  onChange,
  label,
  description,
  icon,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="w-full rounded-2xl border border-slate-800/60 bg-slate-900/70 px-4 py-3 text-left transition hover:border-slate-700"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-slate-800/70 p-2 text-slate-200">{icon}</div>
          <div>
            <div className="text-sm font-semibold text-slate-100">{label}</div>
            <div className="text-xs text-slate-400">{description}</div>
          </div>
        </div>
        <div
          className={`h-6 w-11 rounded-full p-1 transition ${checked ? 'bg-emerald-500/80' : 'bg-slate-700/70'
            }`}
        >
          <div
            className={`h-4 w-4 rounded-full bg-white shadow transition ${checked ? 'translate-x-5' : 'translate-x-0'
              }`}
          />
        </div>
      </div>
    </button>
  );
}

export default function Visualizer() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [selectedVillageId, setSelectedVillageId] = useState<string | null>(null);
  const [heavyMonsoon, setHeavyMonsoon] = useState(false);
  const [satelliteBackup, setSatelliteBackup] = useState(false);
  const [networkCongestion, setNetworkCongestion] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/login');
      } else {
        setUser(currentUser);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  const selectedVillage = useMemo(
    () => villages.find((v) => v.id === selectedVillageId) ?? villages[0],
    [selectedVillageId]
  );

  const villageScores = useMemo(() => {
    return villages.map((v) => {
      let score = v.baseScore;
      if (heavyMonsoon) score = Math.max(0, Math.round(score * 0.6));
      if (satelliteBackup) score = 100;
      const atRisk = heavyMonsoon || score < 60;
      return { ...v, score, atRisk };
    });
  }, [heavyMonsoon, satelliteBackup]);

  const leafletIcons = useMemo(() => {
    const createIcon = (color: 'green' | 'red') =>
      L.divIcon({
        className: '',
        html: `<div class="pulse-marker ${color}"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });
    return {
      green: createIcon('green'),
      red: createIcon('red'),
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-slate-950 text-slate-100"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex min-h-screen">
        <aside className="hidden w-64 flex-col border-r border-slate-800/60 bg-slate-950/80 p-6 lg:flex">
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-400">
              <Radar className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm uppercase tracking-[0.25em] text-slate-500">SDG 9.11</div>
              <div className="text-lg font-semibold">Rural Broadband</div>
            </div>
          </div>
          <nav className="space-y-2 text-sm">
            {[
              { icon: <LayoutDashboard className="h-4 w-4" />, label: 'Dashboard' },
              { icon: <Satellite className="h-4 w-4" />, label: 'Satellite Map' },
              { icon: <BarChart3 className="h-4 w-4" />, label: 'Analytics' },
              { icon: <Activity className="h-4 w-4" />, label: 'Risk Models' },
              { icon: <Settings className="h-4 w-4" />, label: 'Settings' },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-xl border border-slate-800/60 bg-slate-900/50 px-4 py-3 text-slate-300"
              >
                <span className="text-emerald-400">{item.icon}</span>
                {item.label}
              </div>
            ))}
          </nav>
          <div className="mt-auto rounded-2xl border border-slate-800/70 bg-slate-900/40 p-4 text-xs text-slate-400">
            <div className="text-sm font-semibold text-slate-200">Mission Control</div>
            <div className="mt-2">Secure link active · 02:18 UTC</div>
          </div>
        </aside>

        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-sm">
            <div className="flex items-center justify-between px-6 py-4">
              <div>
                <h1 className="text-xl font-semibold">Rural Broadband Resilience Project</h1>
                <p className="text-xs text-slate-400">Protected Route · Live Simulation Dashboard</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden items-center gap-2 rounded-full border border-slate-800/70 bg-slate-900/60 px-3 py-1 text-xs text-slate-300 md:flex">
                  <UserCircle2 className="h-4 w-4 text-slate-400" />
                  {user?.displayName || user?.email || 'Analyst'}
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 rounded-full border border-slate-800/70 bg-slate-900/60 px-4 py-2 text-xs text-slate-300 transition hover:text-white"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 px-6 py-6">
            <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
              <div className="space-y-6">
                <div className="rounded-3xl border border-slate-800/70 bg-slate-900/40 p-4">
                  <div className="flex items-center justify-between px-2 pb-3">
                    <div>
                      <h2 className="text-lg font-semibold">Satellite Intelligence Map</h2>
                      <p className="text-xs text-slate-400">Tap a village to inspect resilience metrics.</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" /> High Resilience
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-red-400" /> At Risk
                      </span>
                    </div>
                  </div>
                  <div className="h-[520px] overflow-hidden rounded-2xl border border-slate-800/70">
                    <MapContainer center={mapCenter} zoom={6} scrollWheelZoom className="h-full w-full">
                      <TileLayer
                        attribution='Tiles &copy; Esri'
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                      />
                      {villageScores.map((village) => (
                        <Marker
                          key={village.id}
                          position={village.position}
                          icon={village.atRisk ? leafletIcons.red : leafletIcons.green}
                          eventHandlers={{
                            click: () => setSelectedVillageId(village.id),
                          }}
                        />
                      ))}
                    </MapContainer>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {villageScores.map((village) => (
                    <div
                      key={village.id}
                      className={`rounded-2xl border px-4 py-3 transition ${village.id === selectedVillage.id
                          ? 'border-emerald-500/70 bg-emerald-500/10'
                          : 'border-slate-800/70 bg-slate-900/40'
                        }`}
                      onClick={() => setSelectedVillageId(village.id)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold text-slate-100">{village.name}</div>
                          <div className="text-xs text-slate-400">
                            {village.atRisk ? 'At Risk' : 'High Resilience'}
                          </div>
                        </div>
                        <div className="text-xl font-semibold">
                          <AnimatedNumber value={village.score} suffix="%" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-3xl border border-slate-800/60 bg-white/5 p-6 shadow-xl shadow-slate-950/40 backdrop-blur">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs uppercase tracking-[0.3em] text-emerald-400">Intelligence</div>
                      <h3 className="text-xl font-semibold text-white">{selectedVillage.name}</h3>
                    </div>
                    <div
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${villageScores.find((v) => v.id === selectedVillage.id)?.atRisk
                          ? 'bg-red-500/20 text-red-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                    >
                      {villageScores.find((v) => v.id === selectedVillage.id)?.atRisk
                        ? 'At Risk'
                        : 'High Resilience'}
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between gap-6">
                    <div>
                      <div className="text-xs text-slate-400">Connectivity Health</div>
                      <HealthGauge value={villageScores.find((v) => v.id === selectedVillage.id)?.score ?? 0} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Terrain Profile</span>
                        <span>Elevation (m)</span>
                      </div>
                      <TerrainChart points={selectedVillage.terrain} congestion={networkCongestion} />
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl border border-slate-800/70 bg-slate-900/60 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                      <AlertTriangle className="h-4 w-4 text-amber-400" />
                      Recommendation
                    </div>
                    <p className="mt-2 text-sm text-slate-300">
                      Priority: High. Suggested Action: Deploy LEO Satellite Relay.
                    </p>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-800/70 bg-slate-900/60 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs uppercase tracking-[0.3em] text-slate-400">Control Center</div>
                      <h3 className="text-lg font-semibold text-white">Simulation Engine</h3>
                    </div>
                    <Gauge className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div className="mt-4 space-y-3">
                    <ToggleSwitch
                      checked={heavyMonsoon}
                      onChange={(value) => {
                        setHeavyMonsoon(value);
                        if (value) setSatelliteBackup(false);
                      }}
                      label="Heavy Monsoon"
                      description="Reduce health by 40% and flag risk."
                      icon={<CloudRain className="h-4 w-4" />}
                    />
                    <ToggleSwitch
                      checked={satelliteBackup}
                      onChange={(value) => {
                        setSatelliteBackup(value);
                        if (value) setHeavyMonsoon(false);
                      }}
                      label="Satellite Backup"
                      description="Restore scores to 100%."
                      icon={<Satellite className="h-4 w-4" />}
                    />
                    <ToggleSwitch
                      checked={networkCongestion}
                      onChange={setNetworkCongestion}
                      label="Network Congestion"
                      description="Trigger latency warnings."
                      icon={<SignalHigh className="h-4 w-4" />}
                    />
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {satelliteBackup && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed bottom-6 right-6 rounded-2xl border border-emerald-400/40 bg-emerald-500/20 px-5 py-3 text-sm text-emerald-100 shadow-xl"
        >
          Satellite Link Established · Scores stabilized at 100%
        </motion.div>
      )}
    </motion.div>
  );
}
