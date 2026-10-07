import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BrainCircuit } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Segmentation', path: '/segmentation' },
    { name: 'Classification', path: '/classification' },
  ];

  return (
    <nav style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 100,
      background: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'white' }}>
        <BrainCircuit size={32} color="#3b82f6" />
        <span style={{ fontSize: '1.5rem', fontWeight: '700' }} className="text-gradient">NeuroScan</span>
      </Link>

      <div style={{ display: 'flex', gap: '24px' }}>
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link 
              key={link.path} 
              to={link.path}
              style={{
                textDecoration: 'none',
                color: isActive ? '#f8fafc' : '#94a3b8',
                fontWeight: isActive ? '600' : '500',
                position: 'relative',
                padding: '0.5rem 0'
              }}
            >
              {link.name}
              {isActive && (
                <motion.div
                  layoutId="navbar-indicator"
                  style={{
                    position: 'absolute',
                    bottom: -1,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: '#3b82f6',
                    borderRadius: '2px'
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;
