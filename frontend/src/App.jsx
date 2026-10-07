import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Segmentation from './pages/Segmentation';
import Classification from './pages/Classification';

function App() {
  const location = useLocation();

  return (
    <>
      <Navbar />
      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', marginTop: '80px' }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/segmentation" element={<Segmentation />} />
            <Route path="/classification" element={<Classification />} />
          </Routes>
        </AnimatePresence>
      </main>
    </>
  );
}

export default App;
