import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// --- Import Components ---
import FactoryOverview from '../components/FactoryOverview';
import MachineList from '../components/MachineList';
import Logs from '../components/Logs';
import Alerts from '../components/Alerts';

// --- Import Icons ---
import { 
    LayoutDashboard, 
    Server, // Icon for Machines
    AlertTriangle, 
    FileText, 
    LogOut, 
    User 
} from 'lucide-react';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const navigate = useNavigate();
    const userRole = localStorage.getItem('role') || 'Viewer';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/');
    };

    const NavItem = ({ id, icon: Icon, label }) => (
        <div 
            onClick={() => setActiveTab(id)}
            style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 16px', cursor: 'pointer',
                backgroundColor: activeTab === id ? 'var(--accent)' : 'transparent',
                color: activeTab === id ? 'white' : 'var(--text-secondary)',
                borderRadius: '8px', marginBottom: '8px', transition: 'all 0.2s',
                fontWeight: 500
            }}
        >
            <Icon size={20} />
            <span>{label}</span>
        </div>
    );

    return (
        <div className="dashboard-container">
            {/* --- SIDEBAR --- */}
            <aside style={{ width: '260px', backgroundColor: 'var(--sidebar-dark)', padding: '24px', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.4rem' }}>
                    <Server color="var(--accent)" size={28} /> FactoryOS
                </h2>

                <nav style={{ flex: 1 }}>
                    {/*RENAMED TABS */}
                    <NavItem id="overview" icon={LayoutDashboard} label="Factory Overview" />
                    <NavItem id="machines" icon={Server} label="All Machines" />
                    <NavItem id="alerts" icon={AlertTriangle} label="System Alerts" />
                    <NavItem id="logs" icon={FileText} label="Activity Logs" />
                </nav>

                <div style={{ padding: '16px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px', marginBottom: '16px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ background: 'var(--accent)', padding: '8px', borderRadius: '50%' }}>
                            <User size={16} color="white" />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Logged In</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{userRole}</div>
                        </div>
                    </div>
                </div>

                <button onClick={handleLogout} className="btn-danger" style={{ width: '100%' }}>
                    <LogOut size={18} /> Logout
                </button>
            </aside>

            {/* --- MAIN CONTENT AREA --- */}
            <main className="main-content">
                <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                    <div>
                        <h1>
                            {activeTab === 'overview' ? 'Factory Health Overview' : 
                             activeTab === 'machines' ? 'Machine Control Center' :
                             activeTab === 'alerts' ? 'Critical Alerts' : 'System Logs'}
                        </h1>
                        <p>
                            {activeTab === 'overview' ? 'Aggregate metrics and production statistics' : 'Manage and monitor individual units'}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <span className="badge badge-active">● System Online</span>
                    </div>
                </header>

                {/* --- CONTENT SWITCHER --- */}
                {activeTab === 'overview' && <FactoryOverview />}
                {activeTab === 'machines' && <MachineList />}
                {activeTab === 'alerts' && <Alerts />}
                {activeTab === 'logs' && <Logs />}
            </main>
        </div>
    );
};

export default Dashboard;