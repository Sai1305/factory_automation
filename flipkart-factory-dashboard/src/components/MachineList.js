import React, { useEffect, useState } from 'react';
import { getMachines, updateMachineStatus } from '../services/api';
import MachineControlModal from './MachineControlModal';
import { Settings, Play, Square, Thermometer, Zap, Activity } from 'lucide-react';

const MachineList = () => {
    const [machines, setMachines] = useState([]);
    const [selectedMachine, setSelectedMachine] = useState(null); // State for modal

    // Fetch data loop
    useEffect(() => {
        const fetchMachines = async () => {
            try {
                const data = await getMachines();
                setMachines(data);
            } catch (error) {
                console.error("Error fetching machines:", error);
            }
        };

        fetchMachines();
        const interval = setInterval(fetchMachines, 1000);
        return () => clearInterval(interval);
    }, []);

    // Quick Start/Stop
    const handleStatusChange = async (id, status) => {
        try {
            await updateMachineStatus(id, status);
            setMachines(prev => prev.map(m => m._id === id ? { ...m, status } : m));
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    return (
        <div className="card-grid">
            {machines.map((machine) => (
                <div key={machine._id} className="machine-card">
                    
                    {/* Header */}
                    <div className="card-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Settings size={20} color="var(--text-secondary)" />
                            <h3>{machine.name}</h3>
                        </div>
                        <span className={`badge badge-${machine.status.toLowerCase()}`}>
                            {machine.status}
                        </span>
                    </div>

                    {/* Metrics Body */}
                    <div style={{ marginBottom: '24px' }}>
                        <div className="metric-row">
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Thermometer size={16} /> Temperature
                            </span>
                            <span className="metric-value" style={{ color: machine.metrics.temperature > 90 ? 'var(--danger)' : 'var(--text-primary)' }}>
                                {machine.metrics.temperature}°C
                            </span>
                        </div>
                        <div className="metric-row">
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Zap size={16} /> Efficiency
                            </span>
                            <span className="metric-value">{machine.metrics.efficiency}%</span>
                        </div>
                        <div className="metric-row">
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Activity size={16} /> Load
                            </span>
                            <span className="metric-value">{machine.metrics.load}%</span>
                        </div>
                    </div>

                    {/* Controls */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                            className="btn-success" 
                            style={{ flex: 1 }}
                            onClick={() => handleStatusChange(machine._id, 'Active')}
                        >
                            <Play size={16} /> Start
                        </button>
                        <button 
                            className="btn-danger" 
                            style={{ flex: 1 }}
                            onClick={() => handleStatusChange(machine._id, 'Idle')}
                        >
                            <Square size={16} /> Stop
                        </button>
                    </div>

                    {/*THIS OPENS THE MODAL */}
                    <div 
                        style={{ marginTop: '15px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--accent)', cursor: 'pointer', fontWeight: 'bold' }}
                        onClick={() => setSelectedMachine(machine)}
                    >
                        ⚙️ Open Control Panel
                    </div>
                </div>
            ))}

            {/*RENDER MODAL IF MACHINE SELECTED */}
            {selectedMachine && (
                <MachineControlModal 
                    machine={selectedMachine} 
                    onClose={() => setSelectedMachine(null)} 
                />
            )}
        </div>
    );
};

export default MachineList;