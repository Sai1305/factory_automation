import React, { useState, useEffect } from 'react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    BarChart, Bar, Legend
} from 'recharts';
import { Thermometer, Zap, Activity, Box } from 'lucide-react';

const FactoryOverview = () => {
    const [data, setData] = useState([]);

    // --- SIMULATE LIVE FACTORY DATA ---
    useEffect(() => {
        const generateData = () => {
            const now = new Date();
            const time = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
            return {
                time,
                temperature: 65 + (Math.random() * 10 - 5), // Avg Temp
                efficiency: 85 + (Math.random() * 10 - 5),  // Avg Efficiency
                production: Math.floor(Math.random() * 50) + 1000, // Units/hr
                vibration: Math.random() * 20 + 10, // Hz
            };
        };

        // Initial Data
        const initial = Array(15).fill(0).map(generateData);
        setData(initial);

        // Live Update Loop
        const interval = setInterval(() => {
            setData(prev => [...prev.slice(1), generateData()]);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    // Helper for Card Styling
    const StatCard = ({ title, value, unit, icon: Icon, color }) => (
        <div style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                <div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{title}</p>
                    <h2 style={{ fontSize: '1.8rem', margin: 0, color: 'white' }}>
                        {typeof value === 'number' ? value.toFixed(1) : value} 
                        <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginLeft: '5px' }}>{unit}</span>
                    </h2>
                </div>
                <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: `${color}20` }}>
                    <Icon size={24} color={color} />
                </div>
            </div>
        </div>
    );

    // Get latest values for the cards
    const latest = data[data.length - 1] || {};

    return (
        <div>
            {/* --- TOP METRICS CARDS --- */}
            <div style={styles.grid}>
                <StatCard title="Avg Temperature" value={latest.temperature} unit="°C" icon={Thermometer} color="#ef4444" />
                <StatCard title="Overall Efficiency" value={latest.efficiency} unit="%" icon={Zap} color="#10b981" />
                <StatCard title="Production Rate" value={latest.production} unit="units/hr" icon={Box} color="#3b82f6" />
                <StatCard title="Vibration Level" value={latest.vibration} unit="Hz" icon={Activity} color="#8b5cf6" />
            </div>

            {/* --- CHARTS SECTION --- */}
            <div style={styles.chartsGrid}>
                
                {/* 1. Temperature & Efficiency Over Time */}
                <div style={styles.chartCard}>
                    <h3 style={styles.chartTitle}>Temperature vs Efficiency Trend</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorEff" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="time" hide />
                                <YAxis yAxisId="left" stroke="#ef4444" />
                                <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                                <Legend />
                                <Area yAxisId="left" type="monotone" dataKey="temperature" name="Avg Temp (°C)" stroke="#ef4444" fill="url(#colorTemp)" />
                                <Area yAxisId="right" type="monotone" dataKey="efficiency" name="Efficiency (%)" stroke="#10b981" fill="url(#colorEff)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. Production Rate & Vibration */}
                <div style={styles.chartCard}>
                    <h3 style={styles.chartTitle}>Production Rate & Vibration Analysis</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="time" hide />
                                <YAxis yAxisId="left" stroke="#3b82f6" />
                                <YAxis yAxisId="right" orientation="right" stroke="#8b5cf6" />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                                <Legend />
                                <Bar yAxisId="left" dataKey="production" name="Production (Units)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                <Bar yAxisId="right" dataKey="vibration" name="Vibration (Hz)" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
};

// --- STYLES ---
const styles = {
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '20px'
    },
    card: {
        backgroundColor: 'var(--sidebar-dark)',
        padding: '24px',
        borderRadius: '16px',
        border: '1px solid var(--border)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)'
    },
    chartsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', // Side-by-side on large screens
        gap: '20px'
    },
    chartCard: {
        backgroundColor: 'var(--sidebar-dark)',
        padding: '20px',
        borderRadius: '16px',
        border: '1px solid var(--border)',
    },
    chartTitle: {
        marginBottom: '20px',
        color: 'var(--text-secondary)',
        fontSize: '1rem'
    }
};

export default FactoryOverview;