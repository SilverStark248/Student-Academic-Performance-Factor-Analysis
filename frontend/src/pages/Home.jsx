import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="page">
      <div className="home-hero">
        <h1>Student Academic Performance Analytical System</h1>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/students" className="btn btn-primary">Add Students</Link>
          <Link to="/analytics" className="btn btn-secondary">View Analytics</Link>
          <Link to="/prediction" className="btn btn-secondary">Predict Marks</Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="card">
          <div className="card-title">How It Works</div>
          <ol style={{ paddingLeft: 20, lineHeight: 2, fontSize: 14 }}>
            <li>Enter at least <strong>7 student records</strong> manually</li>
            <li>The system computes <strong>regression coefficients</strong> using NumPy Normal Equation</li>
            <li>Factor Analysis ranks each factor by <strong>Pearson correlation</strong> with final marks</li>
            <li>Use the Prediction page to estimate marks for a new student</li>
            <li>View full analysis in the Reports section</li>
          </ol>
        </div>

        <div className="card">
          <div className="card-title">Modules Overview</div>
          <table>
            <thead>
              <tr><th>Module</th><th>Method</th></tr>
            </thead>
            <tbody>
              <tr><td>Regression</td><td>Normal Equation (NumPy)</td></tr>
              <tr><td>Factor Analysis</td><td>Pearson Correlation Matrix</td></tr>
              <tr><td>Charts</td><td>Scatter plots via Chart.js</td></tr>
              <tr><td>Database</td><td>SQLite (local file)</td></tr>
              <tr><td>Backend</td><td>Python Flask</td></tr>
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-title">Input Factors Used</div>
          <ul style={{ paddingLeft: 20, fontSize: 14, lineHeight: 2 }}>
            <li>Attendance Percentage</li>
            <li>Internal Marks</li>
            <li>Assignment Marks</li>
            <li>Study Hours Per Day</li>
            <li>Sleep Hours Per Day</li>
            <li>Family Support Rating (1–5)</li>
            <li>Previous Semester GPA</li>
            <li>Final Exam Marks (target)</li>
          </ul>
        </div>


      </div>
    </div>
  );
}

export default Home;
