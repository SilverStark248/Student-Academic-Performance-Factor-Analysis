import { useEffect, useState } from 'react';

const API = 'https://student-academic-performance-factor.onrender.com';

function ReportsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API}/analyze_data`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => {
        setError('Could not connect to backend. Is Flask running?');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="page"><p className="loading">Loading report...</p></div>;
  if (error)   return <div className="page"><div className="alert alert-error">{error}</div></div>;

  if (!data.success) {
    return (
      <div className="page">
        <div className="page-title">Reports</div>
        <div className="alert alert-info">⚠️ {data.error}</div>
      </div>
    );
  }

  const { dashboard, regression, factor_analysis } = data;
  const strongest = factor_analysis.strongest;
  const weakest   = factor_analysis.weakest;
  const second    = factor_analysis.second_strongest;

  // Average error (MAE)
  const mae = regression.predictions.length > 0
    ? (regression.predictions.reduce((s, p) => s + Math.abs(p.error), 0) / regression.predictions.length).toFixed(2)
    : 'N/A';

  // Best and worst students
  const sorted = [...regression.predictions].sort((a, b) => b.actual_marks - a.actual_marks);
  const topStudent    = sorted[0] || null;
  const bottomStudent = sorted[sorted.length - 1] || null;

  const gradeLabel = (marks) => {
    if (marks >= 90) return 'Outstanding (A+)';
    if (marks >= 80) return 'Excellent (A)';
    if (marks >= 70) return 'Good (B)';
    if (marks >= 60) return 'Average (C)';
    if (marks >= 50) return 'Below Average (D)';
    return 'Fail (F)';
  };

  return (
    <div className="page">
      <div className="page-title">Analysis Report</div>

      {/* Summary Section */}
      <div className="card">
        <div className="card-title">Class Performance Summary</div>
        <table>
          <thead><tr><th>Metric</th><th>Value</th></tr></thead>
          <tbody>
            <tr><td>Total Students Analyzed</td><td>{dashboard.total_students}</td></tr>
            <tr><td>Class Average Marks</td><td>{dashboard.average_marks}</td></tr>
            <tr><td>Overall Performance Grade</td><td>{gradeLabel(dashboard.average_marks)}</td></tr>
            <tr><td>Highest Marks</td><td>{dashboard.highest_marks}</td></tr>
            <tr><td>Lowest Marks</td><td>{dashboard.lowest_marks}</td></tr>
            <tr><td>Average Attendance (%)</td><td>{dashboard.average_attendance}</td></tr>
            <tr><td>Regression MAE (Mean Abs. Error)</td><td>{mae} marks</td></tr>
          </tbody>
        </table>
      </div>

      {/* Factor Analysis Summary */}
      <div className="card">
        <div className="card-title">Factor Analysis Report</div>
        <div className="alert alert-success" style={{ marginBottom: 12 }}>
          <strong>Strongest Influencing Factor:</strong> {strongest?.factor} &nbsp;
          (Pearson r = {strongest?.correlation})
        </div>
        <div className="alert alert-info" style={{ marginBottom: 12 }}>
          <strong>Second Strongest Factor:</strong> {second?.factor} &nbsp;
          (Pearson r = {second?.correlation})
        </div>
        <div className="alert alert-error">
          <strong>Weakest Influencing Factor:</strong> {weakest?.factor} &nbsp;
          (Pearson r = {weakest?.correlation})
        </div>

        <div style={{ marginTop: 16 }}>
          <div className="card-title" style={{ fontSize: 14 }}>All Factors Ranked (by |correlation| with Final Marks)</div>
          <ul className="factor-list">
            {factor_analysis.ranked_factors.map((f, i) => (
              <li key={f.key}>
                <span><strong>{i + 1}.</strong> {f.factor}</span>
                <span style={{ color: '#444', fontSize: 13 }}>r = {f.correlation} (|r| = {f.abs_correlation})</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Regression Summary */}
      <div className="card">
        <div className="card-title">Regression Model Report</div>
        <p style={{ fontSize: 13, color: '#555', marginBottom: 12 }}>
          Model: <strong>Final Marks = β₀ + β₁(Attendance) + β₂(Internal) + β₃(Assignment) + β₄(Study Hours) + β₅(GPA)</strong>
        </p>
        <table>
          <thead><tr><th>Coefficient</th><th>Value</th></tr></thead>
          <tbody>
            <tr><td>β₀ (Intercept)</td><td>{regression.model.intercept}</td></tr>
            <tr><td>β₁ (Attendance)</td><td>{regression.model.weights.attendance}</td></tr>
            <tr><td>β₂ (Internal Marks)</td><td>{regression.model.weights.internal_marks}</td></tr>
            <tr><td>β₃ (Assignment Marks)</td><td>{regression.model.weights.assignment_marks}</td></tr>
            <tr><td>β₄ (Study Hours)</td><td>{regression.model.weights.study_hours}</td></tr>
            <tr><td>β₅ (Previous GPA)</td><td>{regression.model.weights.previous_gpa}</td></tr>
          </tbody>
        </table>
      </div>

      {/* Top and Bottom Students */}
      {topStudent && (
        <div className="card">
          <div className="card-title">Top & Bottom Performers</div>
          <table>
            <thead><tr><th>Category</th><th>Name</th><th>Roll No.</th><th>Final Marks</th><th>Grade</th></tr></thead>
            <tbody>
              <tr style={{ background: '#e8f5e9' }}>
                <td>Top Performer</td>
                <td>{topStudent.name}</td>
                <td>{topStudent.roll_number}</td>
                <td>{topStudent.actual_marks}</td>
                <td>{gradeLabel(topStudent.actual_marks)}</td>
              </tr>
              <tr style={{ background: '#ffebee' }}>
                <td>Lowest Marks</td>
                <td>{bottomStudent.name}</td>
                <td>{bottomStudent.roll_number}</td>
                <td>{bottomStudent.actual_marks}</td>
                <td>{gradeLabel(bottomStudent.actual_marks)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Conclusion */}
      <div className="card">
        <div className="card-title">Conclusion</div>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#444' }}>
          Based on the analysis of <strong>{dashboard.total_students}</strong> students,
          the most influential factor on academic performance is <strong>{strongest?.factor}</strong> with a
          Pearson correlation of <strong>{strongest?.correlation}</strong> with final exam marks.
          The class average of <strong>{dashboard.average_marks}</strong> marks corresponds to a
          <strong> {gradeLabel(dashboard.average_marks)}</strong> performance level.
          The regression model uses five predictors to estimate final marks with a mean absolute error
          of <strong>{mae} marks</strong>.
        </p>
      </div>
    </div>
  );
}

export default ReportsPage;
