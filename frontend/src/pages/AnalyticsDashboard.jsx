import { useEffect, useState } from 'react';
import DashboardCards from '../components/DashboardCards';
import Charts from '../components/Charts';
import AnalysisResult from '../components/AnalysisResult';

const API = 'http://127.0.0.1:5000';

function AnalyticsDashboard() {
  const [data, setData] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');

    try {
      const studentsRes = await fetch(`${API}/get_students`);
      const studentsData = await studentsRes.json();
      if (studentsData.success) setStudents(studentsData.students);
    } catch {
      setError('Could not connect to backend. Make sure Flask server is running on port 5000.');
      setLoading(false);
      return;
    }

    try {
      const analysisRes = await fetch(`${API}/analyze_data`);
      // Safe parse to handle any remaining NaN in JSON response
      const text = await analysisRes.text();
      const safeText = text.replace(/:\s*NaN/g, ': 0');
      const analysis = JSON.parse(safeText);
      setData(analysis);
    } catch (err) {
      setData({ success: false, error: `Analysis fetch failed: ${err.message}` });
    }

    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <div className="page"><p className="loading">Loading analytics...</p></div>;
  if (error)   return <div className="page"><div className="alert alert-error">{error}</div></div>;

  return (
    <div className="page">
      <div className="page-title">Analytics Dashboard</div>

      {!data || !data.success ? (
        <div>
          <div className="alert alert-info" style={{ fontSize: 16, padding: 18 }}>
            ⚠️ {data?.error || 'Not enough data for analysis.'}
          </div>
          {students.length > 0 && (
            <>
              <DashboardCards stats={{
                total_students: students.length,
                average_marks: (students.reduce((a, s) => a + s.final_marks, 0) / students.length).toFixed(2),
                highest_marks: Math.max(...students.map(s => s.final_marks)),
                lowest_marks: Math.min(...students.map(s => s.final_marks)),
                average_attendance: (students.reduce((a, s) => a + s.attendance, 0) / students.length).toFixed(2),
              }} />
              <Charts students={students} />
            </>
          )}
        </div>
      ) : (
        <div>
          <DashboardCards stats={data.dashboard} />
          <Charts students={students} />
          <AnalysisResult regression={data.regression} factorAnalysis={data.factor_analysis} />
        </div>
      )}

      <div style={{ textAlign: 'right', marginTop: 10 }}>
        <button className="btn btn-secondary" onClick={fetchData}>Refresh</button>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;