import React, { useEffect, useState } from 'react';
import { getAlerts } from '../services/api';
import { AlertTriangle, CheckCircle } from 'lucide-react';

const Alerts = () => {
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const data = await getAlerts();
                const sortedData = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                setAlerts(sortedData);
            } catch (error) {
                console.error("Error fetching alerts", error);
            }
        };

        fetchAlerts();
        const interval = setInterval(fetchAlerts, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Severity</th>
                        <th>Machine</th>
                        <th>Issue</th>
                        <th>Time (IST)</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {alerts.length === 0 ? (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center', padding: '30px' }}>No active alerts.</td>
                        </tr>
                    ) : (
                        alerts.map((alert) => (
                            <tr key={alert._id}>
                                <td>
                                    {alert.severity === 'Critical' ? (
                                        <span className="badge badge-error"><AlertTriangle size={12}/> Critical</span>
                                    ) : (
                                        <span className="badge badge-idle">Warning</span>
                                    )}
                                </td>
                                <td style={{ fontWeight: 'bold' }}>{alert.machineName || 'Unknown Machine'}</td>
                                <td>{alert.message}</td>
                                <td style={{ fontFamily: 'monospace', color: 'gray' }}>
                                    {new Date(alert.timestamp).toLocaleString('en-IN', { 
                                        timeZone: 'Asia/Kolkata', 
                                        hour12: true, 
                                        hour: '2-digit', 
                                        minute: '2-digit', 
                                        second: '2-digit'
                                    })}
                                </td>
                                <td>
                                    {(alert.status === 'New' || alert.status === 'Open') ? (
                                        <span style={{ color: 'red', fontWeight: 'bold' }}>Active</span>
                                    ) : (
                                        <span style={{ color: 'green' }}><CheckCircle size={16}/> Resolved</span>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Alerts;