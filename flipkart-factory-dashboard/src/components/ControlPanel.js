import React, { useState } from 'react';
import { sendCommand } from '../services/api';

const ControlPanel = ({ machine, onClose, onUpdate }) => {
    const role = localStorage.getItem('role'); 
    const [jobName, setJobName] = useState('');

    const handleAction = async (action, payload = null) => {
        await sendCommand(machine._id, action, payload);
        onUpdate();
        if (action === 'RESET' || action === 'EMERGENCY_STOP') onClose();
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <div style={styles.header}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.2rem' }}>⚙️ Controls: {machine.name}</h2>
                        <span style={{ fontSize: '0.8rem', color: '#666' }}>Role: {role}</span>
                    </div>
                    <button onClick={onClose} style={styles.closeBtn}>X</button>
                </div>

                <div style={styles.content}>
                    <div style={styles.section}>
                        <h4 style={styles.sectionTitle}>Operating State</h4>
                        <div style={styles.btnGroup}>
                            <button onClick={() => handleAction('START')} disabled={machine.status === 'Active'} style={styles.startBtn}>Start</button>
                            <button onClick={() => handleAction('STOP')} disabled={machine.status === 'Idle'} style={styles.stopBtn}>Stop</button>
                            <button onClick={() => handleAction('RESET')} style={styles.resetBtn}>Reset</button>
                        </div>
                    </div>

                    <div style={styles.section}>
                        <h4 style={styles.sectionTitle}>Job Assignment</h4>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input type="text" placeholder="Enter Job ID..." value={jobName} onChange={(e) => setJobName(e.target.value)} style={styles.input} />
                            <button onClick={() => handleAction('ASSIGN_JOB', jobName)} style={styles.actionBtn}>Assign</button>
                        </div>
                    </div>

                    {role === 'Admin' ? (
                        <div style={{ ...styles.section, borderTop: '2px solid red', marginTop: '20px', paddingTop: '10px' }}>
                            <h4 style={{ color: 'red', margin: '0 0 10px 0' }}>⚠️ Danger Zone (Admin Only)</h4>
                            <button onClick={() => handleAction('EMERGENCY_STOP')} style={styles.dangerBtn}>
                                ☢️ TRIGGER EMERGENCY SHUTDOWN
                            </button>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', color: '#999', fontSize: '0.8rem', marginTop: '15px' }}>
                            * Emergency shutdown restricted to Administrators.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modal: { backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '400px', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' },
    header: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' },
    closeBtn: { border: 'none', background: 'none', fontSize: '1.2rem', cursor: 'pointer', fontWeight: 'bold' },
    section: { marginBottom: '15px' },
    sectionTitle: { fontSize: '0.9rem', color: '#555', marginBottom: '8px', textTransform: 'uppercase' },
    btnGroup: { display: 'flex', gap: '10px' },
    startBtn: { flex: 1, padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' },
    stopBtn: { flex: 1, padding: '10px', backgroundColor: '#ffc107', color: 'black', border: 'none', cursor: 'pointer', borderRadius: '4px' },
    resetBtn: { flex: 1, padding: '10px', backgroundColor: '#17a2b8', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' },
    input: { flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' },
    actionBtn: { padding: '8px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' },
    dangerBtn: { width: '100%', padding: '15px', backgroundColor: '#dc3545', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer', borderRadius: '4px' }
};

export default ControlPanel;