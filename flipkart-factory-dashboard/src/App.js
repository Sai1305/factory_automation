import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Machines from './pages/Machines';
import Logs from './pages/Logs';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} /> {/*New Route */}
        
        <Route path="/dashboard" element={ <PrivateRoute><Dashboard /></PrivateRoute>}/>
        <Route path="/machines" element={ <Machines />}/>
        <Route path="/logs" element={<Logs />} />
      </Routes>
    </Router>
  );
}

export default App;