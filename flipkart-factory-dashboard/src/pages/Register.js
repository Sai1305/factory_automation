import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';
import { UserPlus, User, Lock, Info } from 'lucide-react';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            // Backend automatically assigns 'Viewer' role based on your logic
            const data = await registerUser({ username, password });
            
            // Auto-login after register
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            localStorage.setItem('username', data.username);

            navigate('/dashboard');
        } catch (err) {
            setError('Registration Failed. Username may be taken.');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                {/* Header Section */}
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div style={styles.iconCircle}>
                        <UserPlus size={32} color="var(--success)" />
                    </div>
                    <h2 style={{ color: 'white', margin: '10px 0 5px' }}>Create Account</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Join the FactoryOS Team</p>
                </div>

                {error && <div style={styles.error}>{error}</div>}

                <form onSubmit={handleRegister}>
                    {/* Username Input */}
                    <div style={styles.inputGroup}>
                        <User size={20} color="var(--text-secondary)" style={styles.inputIcon} />
                        <input 
                            type="text" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            style={styles.input} 
                            placeholder="Choose a username"
                            required 
                        />
                    </div>
                    
                    {/* Password Input */}
                    <div style={styles.inputGroup}>
                        <Lock size={20} color="var(--text-secondary)" style={styles.inputIcon} />
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            style={styles.input} 
                            placeholder="Choose a password"
                            required 
                        />
                    </div>

                    {/* Role Note */}
                    <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'start', gap: '8px', padding: '10px', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px' }}>
                        <Info size={16} color="var(--accent)" style={{ marginTop: '2px' }} />
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            New accounts are created with <strong style={{ color: 'white' }}>Viewer</strong> access. Admin approval required for Engineer access.
                        </span>
                    </div>

                    <button type="submit" className="btn-success" style={{ width: '100%', justifyContent: 'center' }}>
                        <UserPlus size={18} /> Create Account
                    </button>
                </form>

                {/* Footer Link */}
                <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Already have an account? <Link to="/" style={styles.link}>Login here</Link>
                </div>
            </div>
        </div>
    );
};

// --- DARK THEME STYLES (Matches Login Page) ---
const styles = {
    container: {
        height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
    },
    card: {
        width: '100%', maxWidth: '400px', padding: '40px',
        backgroundColor: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(10px)',
        borderRadius: '16px', border: '1px solid var(--border)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
    },
    iconCircle: {
        width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(34, 197, 94, 0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto'
    },
    inputGroup: { position: 'relative', marginBottom: '20px' },
    input: {
        width: '100%', padding: '12px 12px 12px 45px', borderRadius: '8px',
        border: '1px solid var(--border)', backgroundColor: 'rgba(15, 23, 42, 0.6)',
        color: 'white', fontSize: '1rem', outline: 'none', boxSizing: 'border-box'
    },
    inputIcon: { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' },
    error: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444',
        padding: '10px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', fontSize: '0.9rem'
    },
    link: { color: 'var(--success)', textDecoration: 'none', fontWeight: 'bold' }
};

export default Register;