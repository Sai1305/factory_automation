import React from 'react';
import { LineChart, Line, YAxis, ResponsiveContainer } from 'recharts';

const MiniChart = ({ data, color }) => {
    return (
        <div style={{ width: '100%', height: 80, marginTop: '10px' }}>
            <ResponsiveContainer>
                <LineChart data={data}>
                    {/* Hide the X Axis to save space */}
                    <YAxis domain={['auto', 'auto']} hide /> 
                    <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke={color} 
                        strokeWidth={2} 
                        dot={false} 
                        isAnimationActive={false} // Disable animation for smoother updates
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default MiniChart;