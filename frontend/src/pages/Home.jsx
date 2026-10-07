import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Brain, Activity } from 'lucide-react';

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginTop: '4rem' }}
    >
      <motion.div variants={itemVariants} style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>
          Advanced <span className="text-gradient">Brain Tumor</span> Analysis
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          State-of-the-art deep learning models for precise tumor segmentation and classification using MRI scans.
        </p>
      </motion.div>

      <motion.div variants={itemVariants} style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
        
        <div className="glass-card" style={{ padding: '2rem', width: '300px', textAlign: 'left' }}>
          <Brain size={40} color="#3b82f6" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Segmentation</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            Precisely identify and segment tumor boundaries using our custom BRISC-UNet architecture.
          </p>
          <Link to="/segmentation" className="btn btn-primary" style={{ textDecoration: 'none', width: '100%' }}>
            Start Segmentation <ArrowRight size={18} style={{ marginLeft: '8px' }} />
          </Link>
        </div>

        <div className="glass-card" style={{ padding: '2rem', width: '300px', textAlign: 'left' }}>
          <Activity size={40} color="#8b5cf6" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Classification</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            Categorize brain tumors using GLCM feature extraction and machine learning techniques.
          </p>
          <Link to="/classification" className="btn btn-secondary" style={{ textDecoration: 'none', width: '100%' }}>
            Start Classification <ArrowRight size={18} style={{ marginLeft: '8px' }} />
          </Link>
        </div>

      </motion.div>
    </motion.div>
  );
};

export default Home;
