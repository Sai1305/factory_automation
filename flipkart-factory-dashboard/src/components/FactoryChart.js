import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const FactoryChart = ({ data }) => {
    return (
        <div style={styles.container}>
            <h3 style={{ margin: '0 0 10px 0', color: '#555' }}>📈 Overall Factory Temperature (Avg)</h3>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis domain={[0, 120]} /> {/* Axis from 0 to 120 degrees */}
                        <Tooltip />
                        <Line 
                            type="monotone" 
                            dataKey="avgTemp" 
                            stroke="#8884d8" 
                            strokeWidth={3}
                            dot={false} 
                            animationDuration={500}
                            name="Avg Temp"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '30px',
        border: '1px solid #e0e0e0'
    }
};

export default FactoryChart;