'use client';

import { RiskAnalysis } from '../lib/data';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AlertCircle, AlertTriangle, CheckCircle2, TrendingDown, ArrowRight } from 'lucide-react';

interface SidebarRightProps {
    analysis: RiskAnalysis;
}

export default function SidebarRight({ analysis }: SidebarRightProps) {

    const chartData = [
        { name: 'Terrain', value: analysis.factors.terrain },
        { name: 'Weather', value: analysis.factors.weather },
        { name: 'Distance', value: analysis.factors.distance },
        { name: 'Load', value: analysis.factors.load },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Critical': return 'bg-destructive text-destructive-foreground hover:bg-destructive/90 border-transparent';
            case 'At-Risk': return 'bg-amber-500 text-white hover:bg-amber-600 border-transparent';
            default: return 'bg-emerald-600 text-white hover:bg-emerald-700 border-transparent';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Critical': return <AlertCircle className="w-5 h-5 text-destructive" />;
            case 'At-Risk': return <AlertTriangle className="w-5 h-5 text-amber-600" />;
            default: return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
        }
    };

    return (
        <div className="w-96 flex flex-col gap-6 overflow-y-auto pl-2">
            {/* Overall Score */}
            <Card className="border-l-4 border-l-primary bg-card">
                <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Resilience Score</span>
                        <Badge className={getStatusColor(analysis.status)}>
                            {analysis.status}
                        </Badge>
                    </div>
                    <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-5xl font-extrabold tracking-tighter text-foreground">
                            {analysis.score}
                        </span>
                        <span className="text-sm font-medium text-muted-foreground">/ 100 Risk</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        {getStatusIcon(analysis.status)}
                        <span className="text-foreground font-medium">
                            {analysis.status === 'Stable' ? 'System Within Limits' : 'Mitigation Required'}
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* Factor Breakdown Chart */}
            <Card className="shadow-sm border-border">
                <CardHeader className="p-4 pb-0">
                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Risk Factors</CardTitle>
                </CardHeader>
                <CardContent className="p-4 h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} layout="vertical" margin={{ left: -20, right: 30, top: 10, bottom: 0 }}>
                            <XAxis type="number" domain={[0, 100]} hide />
                            <YAxis dataKey="name" type="category" width={70} tick={{ fontSize: 11, fill: 'var(--foreground)' }} tickLine={false} axisLine={false} />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{
                                    borderRadius: 'var(--radius)',
                                    fontSize: '12px',
                                    border: '1px solid var(--border)',
                                    backgroundColor: 'var(--popover)',
                                    color: 'var(--popover-foreground)'
                                }}
                            />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={18}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.value > 75 ? '#ef4444' : entry.value > 45 ? '#f59e0b' : '#059669'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Recommendations */}
            <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground pl-1">Strategic Recommendations</h4>
                {analysis.recommendations.map((rec) => (
                    <Card key={rec.id} className="shadow-sm border-border hover:border-primary/50 transition-colors cursor-default group">
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                                    {rec.type}
                                </span>
                                <Badge variant="outline" className="text-[10px] font-bold uppercase text-muted-foreground border-border">
                                    {rec.priority} Priority
                                </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                                {rec.description}
                            </p>
                            <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-secondary rounded text-[10px] font-bold text-secondary-foreground group-hover:bg-primary/5 transition-colors">
                                <TrendingDown className="w-3 h-3" />
                                Risk Reduction: {rec.impact}%
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <button className="mt-auto w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-sm">
                Export Report
                <ArrowRight className="w-4 h-4" />
            </button>

        </div>
    );
}
