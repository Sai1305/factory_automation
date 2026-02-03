import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api';
import { Lock, User, LogIn } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await loginUser(formData);
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div style={styles.iconCircle}>
                        <Lock size={32} color="var(--accent)" />
                    </div>
                    <h2 style={{ color: 'white', margin: '10px 0 5px' }}>Welcome Back</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Sign in to access FactoryOS</p>
                </div>

                {error && <div style={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={styles.inputGroup}>
                        <User size={20} color="var(--text-secondary)" style={styles.inputIcon} />
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                    </div>
                    
                    <div style={styles.inputGroup}>
                        <Lock size={20} color="var(--text-secondary)" style={styles.inputIcon} />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
                        <LogIn size={18} /> Sign In
                    </button>
                </form>
                <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Don't have an account? <Link to="/register" style={styles.link}>Register here</Link>
                </div>
            </div>
        </div>
    );
};

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
        width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(59, 130, 246, 0.1)',
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
    link: { color: 'var(--accent)', textDecoration: 'none', fontWeight: 'bold' }
};

export default Login;