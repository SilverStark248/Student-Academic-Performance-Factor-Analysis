import { useState, useEffect } from 'react';

const API = 'http://127.0.0.1:5000';

const emptyForm = {
  name: '',
  attendance: '', internal_marks: '', assignment_marks: '',
  study_hours: '', sleep_hours: '', family_support: '3', previous_gpa: ''
};

function PredictionPage() {
  const [form, setForm] = useState(emptyForm);
  const [result, setResult] = useState(null);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API}/get_students`)
      .then(r => r.json())
      .then(d => { if (d.success) setCount(d.count); })
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch(`${API}/predict_marks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.predicted_marks);
      } else {
        setError(data.error);
      }
    } catch {
      setError('Could not connect to backend.');
    }
    setLoading(false);
  };

  const handleReset = () => {
    setForm(emptyForm);
    setResult(null);
    setError('');
  };

  const canPredict = count >= 7;

  return (
    <div className="page">
      <div className="page-title">Mark Prediction</div>

      {!canPredict && (
        <div className="alert alert-info">
          ⚠️ Minimum 7 student records are required for prediction.
          Currently {count} record(s) entered. Please add {7 - count} more student(s) on the Student Entry page.
        </div>
      )}

      <div className="card">
        <div className="card-title">Enter Student Data to Predict Final Marks</div>
        <p style={{ fontSize: 13, color: '#555', marginBottom: 14 }}>
          Fill in the fields below. The regression model (built from existing records) will estimate the student's final exam marks.
        </p>
        <form onSubmit={handlePredict}>
          <div className="form-grid">
            <div className="form-group">
              <label>Student Name (optional)</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. New Student" />
            </div>
            <div className="form-group">
              <label>Attendance (%) *</label>
              <input type="number" name="attendance" value={form.attendance} onChange={handleChange}
                required min="0" max="100" step="0.01" disabled={!canPredict} />
            </div>
            <div className="form-group">
              <label>Internal Marks (0–100) *</label>
              <input type="number" name="internal_marks" value={form.internal_marks} onChange={handleChange}
                required min="0" max="100" step="0.01" disabled={!canPredict} />
            </div>
            <div className="form-group">
              <label>Assignment Marks (0–100) *</label>
              <input type="number" name="assignment_marks" value={form.assignment_marks} onChange={handleChange}
                required min="0" max="100" step="0.01" disabled={!canPredict} />
            </div>
            <div className="form-group">
              <label>Study Hours / Day *</label>
              <input type="number" name="study_hours" value={form.study_hours} onChange={handleChange}
                required min="0" max="24" step="0.5" disabled={!canPredict} />
            </div>
            <div className="form-group">
              <label>Sleep Hours / Day</label>
              <input type="number" name="sleep_hours" value={form.sleep_hours} onChange={handleChange}
                min="0" max="24" step="0.5" disabled={!canPredict} />
            </div>
            <div className="form-group">
              <label>Family Support Rating (1–5)</label>
              <select name="family_support" value={form.family_support} onChange={handleChange} disabled={!canPredict}>
                {[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Previous Semester GPA (0–10) *</label>
              <input type="number" name="previous_gpa" value={form.previous_gpa} onChange={handleChange}
                required min="0" max="10" step="0.01" disabled={!canPredict} />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={!canPredict || loading}>
              {loading ? 'Predicting...' : 'Predict Marks'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleReset}>Reset</button>
          </div>
        </form>

        {error && <div className="alert alert-error" style={{ marginTop: 16 }}>{error}</div>}

        {result !== null && (
          <div className="prediction-result">
            <div className="pred-label">Predicted Final Exam Marks</div>
            <div className="pred-value">{result} / 100</div>
            <div style={{ fontSize: 13, color: '#555', marginTop: 10 }}>
              Based on Multiple Linear Regression trained on {count} student records.
              {form.name && <span> Prediction for: <strong>{form.name}</strong></span>}
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-title">Model Information</div>
        <table>
          <thead><tr><th>Item</th><th>Detail</th></tr></thead>
          <tbody>
            <tr><td>Algorithm</td><td>Multiple Linear Regression</td></tr>
            <tr><td>Method</td><td>Normal Equation: β = (XᵀX)⁻¹ Xᵀy</td></tr>
            <tr><td>Features Used</td><td>Attendance, Internal Marks, Assignment Marks, Study Hours, Previous GPA</td></tr>
            <tr><td>Training Records</td><td>{count}</td></tr>
            <tr><td>Min. Records Required</td><td>7</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PredictionPage;
