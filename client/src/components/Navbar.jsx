import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Briefcase,
  Calendar,
  Award,
  Sparkles,
  Sun,
  Moon,
  LogOut,
  LogIn,
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      style={{
        backgroundColor: 'var(--bg-card)',
        borderBottom: '1px solid var(--border-color)',
        padding: '0.75rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Brand Logo */}
      <Link
        to="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          textDecoration: 'none',
          color: 'var(--primary)',
          fontSize: '1.2rem',
          fontWeight: '700',
        }}
      >
        <Briefcase size={24} />
        <span>JobTracker</span>
      </Link>

      {/* Navigation Links for Authenticated Users */}
      {user && (
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Link
            to="/"
            className="btn btn-outline"
            style={{
              borderColor: isActive('/') ? 'var(--primary)' : 'transparent',
              color: isActive('/') ? 'var(--primary)' : 'var(--text-main)',
            }}
          >
            <Briefcase size={16} /> Dashboard
          </Link>

          <Link
            to="/calendar"
            className="btn btn-outline"
            style={{
              borderColor: isActive('/calendar') ? 'var(--primary)' : 'transparent',
              color: isActive('/calendar') ? 'var(--primary)' : 'var(--text-main)',
            }}
          >
            <Calendar size={16} /> Calendar
          </Link>

          <Link
            to="/skills"
            className="btn btn-outline"
            style={{
              borderColor: isActive('/skills') ? 'var(--primary)' : 'transparent',
              color: isActive('/skills') ? 'var(--primary)' : 'var(--text-main)',
            }}
          >
            <Award size={16} /> Skills
          </Link>

          <Link
            to="/ai-prep"
            className="btn btn-outline"
            style={{
              borderColor: isActive('/ai-prep') ? 'var(--primary)' : 'transparent',
              color: isActive('/ai-prep') ? 'var(--primary)' : 'var(--text-main)',
            }}
          >
            <Sparkles size={16} /> AI Assistant
          </Link>
        </div>
      )}

      {/* Right Controls: Theme Toggle & User Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Dark/Light Theme Button */}
        <button
          onClick={toggleTheme}
          className="btn btn-outline"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          style={{ padding: '0.55rem' }}
        >
          {theme === 'dark' ? (
            <Sun size={18} color="#f59e0b" />
          ) : (
            <Moon size={18} color="#3b82f6" />
          )}
        </button>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Hi, <strong style={{ color: 'var(--text-main)' }}>{user.name}</strong>
            </span>
            <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem 0.8rem' }}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to="/login" className="btn btn-outline">
              <LogIn size={16} /> Login
            </Link>
            <Link to="/register" className="btn btn-primary">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;