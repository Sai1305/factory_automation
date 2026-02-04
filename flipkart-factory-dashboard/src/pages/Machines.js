import React, { useState, useEffect } from 'react';
import MachineCard from '../components/MachineCard';
import MachineControlModal from '../components/MachineControlModal';
import { getMachines, sendCommand } from '../services/api';
import axios from 'axios';

const Machines = () => {
    const [machines, setMachines] = useState([]);
    const [selectedMachine, setSelectedMachine] = useState(null);
    const role = localStorage.getItem('role');

    // Fetch Machines
    const fetchMachines = async () => {
        try {
            const data = await getMachines();
            setMachines(data);
        } catch (error) {
            console.error("Error fetching machines:", error);
        }
    };

    useEffect(() => {
        fetchMachines();
        const interval = setInterval(fetchMachines, 3000);
        return () => clearInterval(interval);
    }, []);

    // Handle Actions from the Modal (Start/Stop/Assign)
    const handleMachineUpdate = async (id, action, payload) => {
        try {
            if (action === 'ASSIGN_JOB') {
                const token = localStorage.getItem('token');
                await axios.put(`http://localhost:5000/api/machines/${id}`, 
                    { task: payload }, 
                    { headers: { Authorization: `Bearer ${token}` }}
                );
            } else {
                await sendCommand(id, action);
            }
            
            await fetchMachines(); // Refresh data
            setSelectedMachine(null); // Close modal
        } catch (error) {
            console.error("Action failed", error);
        }
    };

    return (
        <div style={{ display: 'flex', backgroundColor: '#f1f5f9', minHeight: '100vh' }}>

            {/* RENDER THE MODAL HERE */}
            {selectedMachine && (
                <MachineControlModal 
                    machine={machines.find(m => m._id === selectedMachine._id) || selectedMachine} 
                    onClose={() => setSelectedMachine(null)}
                    onUpdate={handleMachineUpdate}
                    userRole={role}
                />
            )}
        </div>
    );
};

export default Machines;