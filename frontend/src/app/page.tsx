"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import SatelliteBackground from '@/components/SatelliteBackground';

const tickerItems = [
  'Village Cluster 42: Signal Drop predicted in 2h due to Precipitation.',
  'Node 7A: Rain-fade risk rising · Ka-band attenuation alert.',
  'Terrain Obstruction: Valley ridge shadow impacting microwave hop 12.',
  'Geospatial analysis complete: 14 towers flagged for elevation shielding.',
];

const LaunchPage = () => {
  const router = useRouter();

  const handleLaunch = () => {
    router.push('/login');
  };

  return (
    <div className="relative min-h-screen bg-slate-950 overflow-hidden text-slate-100">
      <SatelliteBackground />
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.15),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(14,116,144,0.25),_transparent_55%)]" />
      </motion.div>

      <motion.div
        className="absolute inset-0 flex items-center justify-center opacity-60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1.5 }}
      >
        <motion.svg
          className="h-full w-full max-w-5xl"
          viewBox="0 0 900 520"
          fill="none"
        >
          <path
            d="M116 244 C162 178 248 142 334 130 C402 120 454 138 510 174 C566 210 636 210 692 180 C740 154 776 114 820 94"
            stroke="#14b8a6"
            strokeOpacity="0.35"
            strokeWidth="1.5"
          />
          <path
            d="M104 310 C186 280 266 282 338 320 C410 358 506 380 604 350 C676 328 742 280 820 260"
            stroke="#38bdf8"
            strokeOpacity="0.25"
            strokeWidth="1.5"
          />
          <motion.path
            d="M140 90 C220 70 330 70 430 110 C520 146 620 170 740 150"
            stroke="#14b8a6"
            strokeOpacity="0.6"
            strokeWidth="2"
            strokeDasharray="6 10"
            animate={{ strokeDashoffset: [0, -80] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          />
          <motion.path
            d="M180 410 C260 440 360 450 460 430 C580 404 680 340 760 280"
            stroke="#14b8a6"
            strokeOpacity="0.5"
            strokeWidth="2"
            strokeDasharray="6 10"
            animate={{ strokeDashoffset: [0, 90] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
          />
          <path
            d="M170 210 C210 180 270 156 332 160 C390 164 430 194 472 220 C520 250 580 270 640 260 C700 248 748 214 790 180"
            stroke="#94a3b8"
            strokeOpacity="0.18"
            strokeWidth="1"
          />
        </motion.svg>
      </motion.div>

      <header className="relative z-10 px-6 py-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-teal-500/40 bg-white/5 text-xs font-bold text-teal-300">
              SDG 9
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Rural Broadband Resilience</div>
              <div className="text-xs uppercase tracking-[0.35em] text-slate-400">SDG 9.11</div>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Satellite Insights</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Risk Models</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Network Ops</span>
          </nav>
        </div>
      </header>

      <main className="relative z-10 px-6 pb-20">
        <div className="mx-auto grid max-w-6xl gap-12 pt-10 md:pt-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl md:p-12"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-teal-300">
              Satellite Resilience Hub
            </div>
            <h1 className="mt-6 text-4xl font-semibold leading-tight text-white md:text-6xl">
              Satellite-Driven Rural Broadband Resilience Hub
            </h1>
            <p className="mt-4 max-w-3xl text-base text-slate-300 md:text-lg">
              Harnessing satellite data to predict connectivity risks and engineer self-healing networks
              for unreached rural communities. (SDG 9.11)
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <motion.button
                onClick={handleLaunch}
                className="relative overflow-hidden rounded-xl bg-[#14b8a6] px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-teal-500/30"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10">Explore Satellite Map</span>
                <motion.span
                  className="absolute inset-0 rounded-xl bg-white/30"
                  animate={{ opacity: [0.2, 0.6, 0.2] }}
                  transition={{ duration: 2.2, repeat: Infinity }}
                />
              </motion.button>
              <button className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-200">
                View Intelligence Brief
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="grid gap-6 md:grid-cols-3"
          >
            {[
              {
                title: 'Geospatial Analysis',
                text: 'Analyze terrain obstructions and distance-to-tower metrics using real-time satellite imagery.',
              },
              {
                title: 'Predictive Failure Modeling',
                text: 'ML-driven risk scores to anticipate outages caused by weather patterns and infrastructure gaps.',
              },
              {
                title: 'Resilience Simulation',
                text: 'Stress-test network stability against extreme weather events and peak user loads.',
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
              >
                <div className="text-xs uppercase tracking-[0.3em] text-teal-300">Capability</div>
                <h3 className="mt-3 text-lg font-semibold text-white">{card.title}</h3>
                <p className="mt-3 text-sm text-slate-300">{card.text}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/10 bg-slate-950/70 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 text-xs text-slate-400 md:flex-row md:items-center md:justify-between">
          <span className="uppercase tracking-[0.3em] text-teal-300">Live Risk Status</span>
          <div className="relative w-full overflow-hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 md:w-2/3">
            <motion.div
              className="flex w-max gap-8 text-slate-200"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            >
              {[...tickerItems, ...tickerItems].map((item, index) => (
                <span key={`${item}-${index}`} className="whitespace-nowrap">
                  {item}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LaunchPage;