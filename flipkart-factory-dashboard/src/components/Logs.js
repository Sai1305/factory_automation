import React, { useEffect, useState } from 'react';
import api from '../services/api'; 

const Logs = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                // This assumes your backend has a GET /logs route
                const response = await api.get('/logs'); 
                setLogs(response.data);
            } catch (error) {
                console.error("Error fetching logs", error);
            }
        };
        fetchLogs();
    }, []);

    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Timestamp</th>
                        <th>User</th>
                        <th>Action</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((log) => (
                        <tr key={log._id}>
                            <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                                {new Date(log.timestamp).toLocaleString()}
                            </td>
                            <td>{log.user || 'System'}</td>
                            <td>
                                <span className="badge badge-idle">{log.action}</span>
                            </td>
                            <td>{log.details}</td>
                        </tr>
                    ))}
                    {logs.length === 0 && (
                        <tr><td colSpan="4" style={{ textAlign: 'center', padding: '30px' }}>No recent activity logs.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Logs;