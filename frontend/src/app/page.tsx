"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardReveal } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Activity, Globe, ShieldCheck, Wifi } from 'lucide-react';

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
    <div className="relative min-h-screen bg-background text-foreground flex flex-col font-sans">

      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center shadow-sm">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-sm font-bold tracking-tight">SDG 9.11 Resilience Platform</span>
              <span className="block text-[10px] text-muted-foreground uppercase tracking-widest">Rural Broadband Intelligence</span>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Risk Models</a>
            <a href="#" className="hover:text-foreground transition-colors">Network Ops</a>
            <Button variant="outline" size="sm" onClick={handleLaunch}>Sign In</Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center">

          <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-xs uppercase tracking-widest font-bold">
            Satellite-Driven Analytics
          </Badge>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground max-w-4xl mb-6">
            Predict & Prevent Broadband Outages in <span className="text-primary">Rural Connectivity</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
            Harnessing real-time satellite data and terrain analysis to engineer self-healing networks for unreached communities.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button size="lg" onClick={handleLaunch} className="px-8 h-12 text-base shadow-lg shadow-primary/20">
              Explore Satellite Map <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button variant="outline" size="lg" className="px-8 h-12 text-base">
              View Methodology
            </Button>
          </div>

          {/* Mock Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 w-full max-w-5xl rounded-xl border border-border shadow-2xl overflow-hidden bg-card"
          >
            <div className="h-10 bg-muted/50 border-b border-border flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400/20 border border-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-amber-400/20 border border-amber-500/50" />
              <div className="w-3 h-3 rounded-full bg-emerald-400/20 border border-emerald-500/50" />
            </div>
            <div className="aspect-[16/9] bg-muted/10 relative flex items-center justify-center">
              <p className="text-sm text-muted-foreground font-mono">Interactive Risk Visualization Engine Preview</p>
            </div>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-6 py-24 border-t border-border">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card/50 border-border shadow-none hover:border-primary/50 transition-colors">
              <CardHeader>
                <Activity className="w-8 h-8 text-primary mb-2" />
                <CardTitle className="text-lg">Predictive Modeling</CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest text-[10px]">Core Capability</span>
                <CardReveal className="mt-2">
                  ML-driven risk scores to anticipate outages caused by severe weather patterns and infrastructure gaps.
                </CardReveal>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border shadow-none hover:border-primary/50 transition-colors">
              <CardHeader>
                <ShieldCheck className="w-8 h-8 text-primary mb-2" />
                <CardTitle className="text-lg">Resilience Simulation</CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest text-[10px]">Stress Testing</span>
                <CardReveal className="mt-2">
                  Stress-test network component choices against extreme terrain and user load scenarios.
                </CardReveal>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border shadow-none hover:border-primary/50 transition-colors">
              <CardHeader>
                <Wifi className="w-8 h-8 text-primary mb-2" />
                <CardTitle className="text-lg">Geospatial Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest text-[10px]">Real-time Data</span>
                <CardReveal className="mt-2">
                  Analyze line-of-sight obstructions and signal attenuation using live satellite imagery.
                </CardReveal>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer Ticker */}
      <footer className="border-t border-border bg-muted/30 py-4 overflow-hidden">
        <div className="container mx-auto px-6 flex items-center gap-4">
          <Badge variant="outline" className="shrink-0 bg-background text-xs font-bold uppercase tracking-wider">Live Intel</Badge>
          <div className="flex-1 overflow-hidden relative h-6">
            <motion.div
              className="absolute whitespace-nowrap text-xs font-mono text-muted-foreground flex gap-8"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            >
              {[...tickerItems, ...tickerItems].map((item, i) => (
                <span key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
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