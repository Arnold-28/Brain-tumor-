import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Loader2, Activity } from 'lucide-react';

const Classification = () => {
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

    try {
      const response = await fetch('http://localhost:8000/classify', {
        method: 'POST',
        body: formData,
      });

      // Always parse JSON so we can surface the real server-side error message
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        // Use the server's error field if available, fall back to status text
        const msg =
          (data && (data.error || data.detail)) ||
          `Server error: ${response.status} ${response.statusText}`;
        throw new Error(msg);
      }

      if (!data || !data.predicted_class) {
        throw new Error('Incomplete response from server. Please try again.');
      }

      setResult(data);
    } catch (err) {
      setError(err.message || 'An error occurred during classification');
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
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Tumor <span className="text-gradient" style={{ backgroundImage: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)' }}>Classification</span></h1>
        <p style={{ color: 'var(--text-secondary)' }}>Upload a Brain MRI scan to categorize the tumor type using GLCM features.</p>
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
          onClick={() => document.getElementById('file-upload-class').click()}
        >
          <input 
            type="file" 
            id="file-upload-class" 
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
                <Upload size={48} color="#8b5cf6" style={{ marginBottom: '1rem' }} />
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
            className="btn" 
            onClick={handleSubmit} 
            disabled={!file || loading}
            style={{ 
              opacity: (!file || loading) ? 0.5 : 1, 
              width: '100%', 
              maxWidth: '300px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
              color: 'white',
              border: 'none'
            }}
          >
            {loading ? (
              <><Loader2 size={18} className="spin" style={{ marginRight: '8px' }} /> Processing...</>
            ) : (
              <><Activity size={18} style={{ marginRight: '8px' }} /> Classify Tumor</>
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
            <h3 style={{ marginBottom: '1.5rem' }}>Classification Results</h3>
            
            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <div>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Original Image</p>
                <img src={`data:image/png;base64,${result.original_image}`} alt="Original" style={{ maxWidth: '200px', borderRadius: '8px', border: '1px solid var(--card-border)' }} />
              </div>
              <div>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Tumor Focus</p>
                <img src={`data:image/png;base64,${result.segmented_image}`} alt="Segmented Focus" style={{ maxWidth: '200px', borderRadius: '8px', border: '1px solid #8b5cf6', boxShadow: '0 0 15px rgba(139, 92, 246, 0.3)' }} />
              </div>
            </div>

            <motion.div 
              initial={{ scale: 0.9 }} 
              animate={{ scale: 1 }}
              style={{
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                padding: '2rem',
                borderRadius: '12px',
                display: 'inline-block',
                marginBottom: '2rem'
              }}
            >
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Predicted Class</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f8fafc', margin: '0.5rem 0' }}>
                {result.predicted_class}
              </div>
              <div style={{ fontSize: '1rem', color: '#10b981', fontWeight: 'bold' }}>
                Confidence: {result.confidence}%
              </div>
            </motion.div>

            {result.features && (
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '8px', textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
                <h4 style={{ marginBottom: '1rem', color: 'var(--text-secondary)', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem' }}>Extracted GLCM Features</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  {Object.entries(result.features).map(([key, val]) => (
                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.25rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>{key}:</span>
                      <span style={{ fontWeight: '500' }}>{typeof val === 'number' ? val.toFixed(4) : val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
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

export default Classification;
