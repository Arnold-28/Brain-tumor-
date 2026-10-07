import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Loader2, Image as ImageIcon } from 'lucide-react';

const Segmentation = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;
    
    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('mode', 'UNet Only');

    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Segmentation failed');
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'An error occurred during segmentation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      style={{ maxWidth: '800px', margin: '0 auto' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Tumor <span className="text-gradient">Segmentation</span></h1>
        <p style={{ color: 'var(--text-secondary)' }}>Upload a Brain MRI scan to automatically detect and segment tumor boundaries.</p>
      </div>

      <div className="glass-card" style={{ padding: '2rem' }}>
        <div 
          style={{
            border: '2px dashed var(--card-border)',
            borderRadius: '12px',
            padding: '3rem 2rem',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            backgroundColor: 'rgba(0,0,0,0.2)',
            position: 'relative',
            overflow: 'hidden'
          }}
          onClick={() => document.getElementById('file-upload').click()}
        >
          <input 
            type="file" 
            id="file-upload" 
            accept="image/jpeg, image/png, image/jpg" 
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          
          <AnimatePresence mode="wait">
            {!preview ? (
              <motion.div
                key="upload-prompt"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <Upload size={48} color="#3b82f6" style={{ marginBottom: '1rem' }} />
                <h3 style={{ marginBottom: '0.5rem' }}>Click or drag to upload</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Supports JPG, PNG (Max 5MB)</p>
              </motion.div>
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <img src={preview} alt="Preview" style={{ maxHeight: '200px', borderRadius: '8px', marginBottom: '1rem' }} />
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{file.name}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
          <button 
            className="btn btn-primary" 
            onClick={handleSubmit} 
            disabled={!file || loading}
            style={{ opacity: (!file || loading) ? 0.5 : 1, width: '100%', maxWidth: '300px' }}
          >
            {loading ? (
              <><Loader2 size={18} className="spin" style={{ marginRight: '8px' }} /> Processing...</>
            ) : (
              <><ImageIcon size={18} style={{ marginRight: '8px' }} /> Segment Image</>
            )}
          </button>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: '1rem', color: '#ef4444', textAlign: 'center' }}>
            {error}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card"
            style={{ marginTop: '2rem', padding: '2rem', textAlign: 'center' }}
          >
            <h3 style={{ marginBottom: '1.5rem' }}>Analysis Results</h3>
            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <div>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Original Image</p>
                <img src={preview} alt="Original" style={{ maxWidth: '300px', borderRadius: '8px', border: '1px solid var(--card-border)' }} />
              </div>
              <div>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Segmented Output</p>
                <img src={`data:image/jpeg;base64,${result.result_image}`} alt="Segmented" style={{ maxWidth: '300px', borderRadius: '8px', border: '1px solid #3b82f6', boxShadow: '0 0 15px rgba(59, 130, 246, 0.3)' }} />
              </div>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>{result.message}</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </motion.div>
  );
};

export default Segmentation;
