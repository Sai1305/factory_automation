import React from 'react';
import { Activity, Thermometer, Zap } from 'lucide-react';

const MachineCard = ({ machine, onClick }) => { 
    const isError = machine.status === 'Error';
    const isActive = machine.status === 'Active';
    const statusColor = isActive ? '#10b981' : isError ? '#ef4444' : '#94a3b8';

    return (
        <div style={{...styles.card, borderColor: statusColor}} onClick={() => onClick(machine)}>
            {/* Header */}
            <div style={styles.header}>
                <h3 style={styles.title}>{machine.name}</h3>
                <span style={{...styles.badge, backgroundColor: statusColor}}>{machine.status}</span>
            </div>

            {/* Metrics Grid */}
            <div style={styles.grid}>
                <div style={styles.metric}>
                    <Thermometer size={16} color="#f59e0b"/>
                    <span>{machine.metrics.temperature}°C</span>
                </div>
                <div style={styles.metric}>
                    <Zap size={16} color="#eab308"/>
                    <span>{machine.metrics.efficiency}% Eff</span>
                </div>
                <div style={styles.metric}>
                    <Activity size={16} color="#3b82f6"/>
                    <span>{machine.metrics.load}% Load</span>
                </div>
            </div>

            {/* Footer */}
            <div style={styles.footer}>
                <span style={{fontSize: '0.8rem', color: '#64748b'}}>Job: {machine.task || 'Idle'}</span>
                <span style={{fontSize: '0.8rem', color: '#3b82f6'}}>Manage ➔</span>
            </div>
        </div>
    );
};

const styles = {
    card: { backgroundColor: 'white', borderRadius: '8px', padding: '15px', width: '260px', borderTop: '4px solid', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'transform 0.2s' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
    title: { margin: 0, fontSize: '1.1rem', color: '#1e293b' },
    badge: { padding: '2px 8px', borderRadius: '10px', fontSize: '0.75rem', color: 'white', fontWeight: 'bold' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' },
    metric: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: '#475569' },
    footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }
};

export default MachineCard;