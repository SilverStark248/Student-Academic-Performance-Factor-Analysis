import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import StudentEntry from './pages/StudentEntry';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import PredictionPage from './pages/PredictionPage';
import ReportsPage from './pages/ReportsPage';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/students" element={<StudentEntry />} />
        <Route path="/analytics" element={<AnalyticsDashboard />} />
        <Route path="/prediction" element={<PredictionPage />} />
        <Route path="/reports" element={<ReportsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
