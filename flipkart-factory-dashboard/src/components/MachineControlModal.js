import React, { useState, useEffect } from 'react';
import { updateMachine, updateMachineStatus } from '../services/api';
import { 
    X, Play, Square, RefreshCw, AlertOctagon, 
    Cpu, Briefcase, Activity, Lock
} from 'lucide-react';
import { 
    LineChart, Line, AreaChart, Area, YAxis, 
    CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const MachineControlModal = ({ machine, onClose }) => {
    const [jobName, setJobName] = useState(machine.currentJob || '');
    const [mode, setMode] = useState(machine.mode || 'Auto');
    const [dataHistory, setDataHistory] = useState([]); 
    const userRole = localStorage.getItem('role');
    
    // Check if user has permission to edit (Admin or Engineer only)
    const canEdit = userRole === 'Admin' || userRole === 'Engineer';

    // --- 1. LIVE DATA SIMULATION ---
    useEffect(() => {
        const generatePoint = () => {
            const now = new Date();
            const timeLabel = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
            const isRunning = machine.status === 'Active';
            const baseTemp = isRunning ? (machine.metrics.temperature || 60) : 25;
            
            return {
                time: timeLabel,
                temperature: baseTemp + (Math.random() * 5 - 2.5),
                efficiency: isRunning ? (machine.metrics.efficiency || 90) + (Math.random() * 2 - 1) : 0,
                vibration: isRunning ? (Math.random() * 10) + 20 : 0, 
            };
        };

        const initialData = Array(10).fill(0).map(generatePoint);
        setDataHistory(initialData);

        const interval = setInterval(() => {
            setDataHistory(prev => [...prev.slice(1), generatePoint()]);
        }, 2000);

        return () => clearInterval(interval);
    }, [machine]);

    // --- API HANDLERS ---
    const handleAction = async (status) => {
        if (!canEdit) return; // Block Viewers
        try {
            await updateMachineStatus(machine._id, status);
        } catch (error) {
            console.error("Action failed", error);
        }
    };

    const toggleMode = async () => {
        if (!canEdit) return; // Block Viewers
        const newMode = mode === 'Auto' ? 'Manual' : 'Auto';
        setMode(newMode);
        await updateMachine(machine._id, { mode: newMode });
    };

    const handleAssignJob = async (e) => {
        e.preventDefault();
        if (!canEdit) return; // Block Viewers
        await updateMachine(machine._id, { currentJob: jobName });
        alert(`Job "${jobName}" assigned!`);
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                
                {/* --- HEADER --- */}
                <div style={styles.header}>
                    <div>
                        <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Cpu color="var(--accent)" /> {machine.name}
                        </h2>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                            <small style={{ color: 'var(--text-secondary)' }}>ID: {machine._id}</small>
                            <span className={`badge badge-${machine.status.toLowerCase()}`}>{machine.status}</span>
                        </div>
                    </div>
                    <button onClick={onClose} style={styles.closeBtn}><X size={24} /></button>
                </div>

                {/* --- MAIN GRID LAYOUT --- */}
                <div style={styles.contentGrid}>
                    
                    {/* LEFT COLUMN: CONTROLS */}
                    <div style={styles.column}>
                        <h3 style={styles.sectionTitle}>
                            Control Panel 
                            {!canEdit && <span style={styles.readOnlyBadge}><Lock size={12}/> Read Only</span>}
                        </h3>

                        {/* Mode Switch */}
                        <div style={{...styles.card, opacity: canEdit ? 1 : 0.5}}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <label style={{ fontWeight: 'bold' }}>Operating Mode</label>
                                <div 
                                    onClick={toggleMode}
                                    style={{ 
                                        ...styles.toggle, 
                                        backgroundColor: mode === 'Auto' ? 'var(--accent)' : 'var(--text-secondary)',
                                        cursor: canEdit ? 'pointer' : 'not-allowed'
                                    }}
                                >
                                    {mode}
                                </div>
                            </div>
                        </div>

                        {/* Job Assignment */}
                        <div style={{...styles.card, opacity: canEdit ? 1 : 0.5}}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                <Briefcase size={16} /> Assign New Job
                            </label>
                            <form onSubmit={handleAssignJob} style={{ display: 'flex', gap: '10px' }}>
                                <input 
                                    type="text" 
                                    value={jobName} 
                                    onChange={(e) => setJobName(e.target.value)}
                                    placeholder={canEdit ? "Enter Task ID..." : "Access Denied"}
                                    style={styles.input} 
                                    disabled={!canEdit}
                                />
                                <button type="submit" className="btn-primary" disabled={!canEdit}>Assign</button>
                            </form>
                        </div>

                        {/* Action Buttons */}
                        <div style={{...styles.actionGrid, opacity: canEdit ? 1 : 0.5, pointerEvents: canEdit ? 'auto' : 'none'}}>
                            <button onClick={() => handleAction('Active')} className="btn-success" style={styles.largeBtn}>
                                <Play size={20} /> Start
                            </button>
                            <button onClick={() => handleAction('Idle')} className="btn-danger" style={{ ...styles.largeBtn, backgroundColor: '#f59e0b', border: 'none', color: 'white' }}>
                                <Square size={20} /> Stop
                            </button>
                            <button onClick={() => handleAction('Idle')} style={{ ...styles.largeBtn, backgroundColor: '#334155', color: 'white' }}>
                                <RefreshCw size={20} /> Reset
                            </button>
                        </div>

                        {userRole === 'Admin' && (
                            <div style={{ marginTop: 'auto' }}>
                                <button onClick={() => handleAction('Error')} className="btn-danger" style={{ width: '100%', justifyContent: 'center', padding: '15px' }}>
                                    <AlertOctagon size={18} /> EMERGENCY SHUTDOWN
                                </button>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: GRAPHS (Always Visible) */}
                    <div style={styles.column}>
                        <h3 style={styles.sectionTitle}>
                            <Activity size={18} style={{ marginRight: '8px' }}/> Live Analytics
                        </h3>
                        
                        <div style={styles.scrollableGraphs}>
                            <div style={styles.graphCard}>
                                <small style={{ color: '#ef4444', fontWeight: 'bold' }}>Temperature (°C)</small>
                                <div style={{ width: '100%', height: 100 }}>
                                    <ResponsiveContainer>
                                        <AreaChart data={dataHistory}>
                                            <defs>
                                                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                            <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={10} width={30} />
                                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', fontSize: '12px' }} />
                                            <Area type="monotone" dataKey="temperature" stroke="#ef4444" fill="url(#colorTemp)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div style={styles.graphCard}>
                                <small style={{ color: '#10b981', fontWeight: 'bold' }}>Efficiency (%)</small>
                                <div style={{ width: '100%', height: 100 }}>
                                    <ResponsiveContainer>
                                        <AreaChart data={dataHistory}>
                                            <defs>
                                                <linearGradient id="colorEff" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                            <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={10} width={30} />
                                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', fontSize: '12px' }} />
                                            <Area type="monotone" dataKey="efficiency" stroke="#10b981" fill="url(#colorEff)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div style={styles.graphCard}>
                                <small style={{ color: '#8b5cf6', fontWeight: 'bold' }}>Vibration (Hz)</small>
                                <div style={{ width: '100%', height: 100 }}>
                                    <ResponsiveContainer>
                                        <LineChart data={dataHistory}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                            <YAxis stroke="#94a3b8" fontSize={10} width={30} />
                                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', fontSize: '12px' }} />
                                            <Line type="step" dataKey="vibration" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

// --- STYLES ---
const styles = {
    overlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)',
        display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
    },
    modal: {
        backgroundColor: 'var(--sidebar-dark)', 
        width: '900px',
        height: '600px',
        borderRadius: '16px', 
        padding: '24px', 
        border: '1px solid var(--border)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
        display: 'flex', flexDirection: 'column'
    },
    header: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'start',
        marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '16px'
    },
    closeBtn: { background: 'none', color: 'var(--text-secondary)', padding: 0, cursor: 'pointer' },
    
    contentGrid: {
        display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '30px',
        flex: 1, overflow: 'hidden'
    },
    column: {
        display: 'flex', flexDirection: 'column', gap: '15px', overflowY: 'auto'
    },
    sectionTitle: {
        fontSize: '1.1rem', color: 'var(--text-primary)', margin: '0 0 10px 0',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
    },
    readOnlyBadge: {
        fontSize: '0.75rem', color: 'var(--warning)', 
        backgroundColor: 'rgba(234, 179, 8, 0.1)', padding: '4px 8px', borderRadius: '6px',
        display: 'flex', alignItems: 'center', gap: '4px'
    },
    card: {
        backgroundColor: 'rgba(255,255,255,0.03)', padding: '15px',
        borderRadius: '12px', border: '1px solid var(--border)', transition: 'opacity 0.2s'
    },
    input: {
        flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border)',
        backgroundColor: 'var(--bg-dark)', color: 'white', outline: 'none'
    },
    toggle: {
        padding: '6px 16px', borderRadius: '20px',
        fontWeight: 'bold', transition: 'background 0.3s', color: 'white', fontSize: '0.8rem'
    },
    actionGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginTop: '10px' },
    largeBtn: { flexDirection: 'column', padding: '15px', gap: '8px', fontSize: '0.8rem' },
    
    scrollableGraphs: {
        display: 'flex', flexDirection: 'column', gap: '15px', paddingRight: '5px'
    },
    graphCard: {
        backgroundColor: 'var(--bg-dark)', borderRadius: '12px', padding: '10px',
        border: '1px solid var(--border)'
    }
};

export default MachineControlModal;