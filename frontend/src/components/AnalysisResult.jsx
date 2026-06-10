function AnalysisResult({ regression, factorAnalysis }) {
  if (!regression || !factorAnalysis) return null;

  const { model, predictions } = regression;
  const { ranked_factors } = factorAnalysis;

  const getBadge = (index, total) => {
    if (index === 0) return 'badge-strong';
    if (index === total - 1) return 'badge-weak';
    return 'badge-medium';
  };

  const getBadgeLabel = (index, total) => {
    if (index === 0) return 'Strongest';
    if (index === total - 1) return 'Weakest';
    return 'Moderate';
  };

  return (
    <div>
      {/* Factor Analysis */}
      <div className="card">
        <div className="card-title">Factor Analysis — Influence on Final Marks</div>
        <p style={{ fontSize: 13, color: '#555', marginBottom: 12 }}>
          Ranked by absolute Pearson correlation with Final Marks. Higher value = stronger influence.
        </p>
        <ul className="factor-list">
          {ranked_factors.map((f, i) => (
            <li key={f.key}>
              <span style={{ fontWeight: i === 0 || i === ranked_factors.length - 1 ? 700 : 400 }}>
                {i + 1}. {f.factor}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 13, color: '#444' }}>r = {f.correlation}</span>
                <span className={`factor-badge ${getBadge(i, ranked_factors.length)}`}>
                  {getBadgeLabel(i, ranked_factors.length)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Regression Model Coefficients */}
      <div className="card">
        <div className="card-title">Regression Model — Coefficients</div>
        <p style={{ fontSize: 13, color: '#555', marginBottom: 12 }}>
          Using Normal Equation: <strong>β = (XᵀX)⁻¹ Xᵀy</strong>
        </p>
        <table style={{ marginBottom: 0 }}>
          <thead>
            <tr>
              <th>Feature</th>
              <th>Coefficient</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Intercept</td><td>{model.intercept}</td></tr>
            <tr><td>Attendance (%)</td><td>{model.weights.attendance}</td></tr>
            <tr><td>Internal Marks</td><td>{model.weights.internal_marks}</td></tr>
            <tr><td>Assignment Marks</td><td>{model.weights.assignment_marks}</td></tr>
            <tr><td>Study Hours/Day</td><td>{model.weights.study_hours}</td></tr>
            <tr><td>Previous GPA</td><td>{model.weights.previous_gpa}</td></tr>
          </tbody>
        </table>
      </div>

      {/* Prediction vs Actual */}
      <div className="card">
        <div className="card-title">Regression Predictions vs Actual Marks</div>
        <div className="table-wrapper">
          <table className="reg-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Roll No.</th>
                <th>Actual Marks</th>
                <th>Predicted Marks</th>
                <th>Error (Actual − Predicted)</th>
              </tr>
            </thead>
            <tbody>
              {predictions.map((p, i) => (
                <tr key={p.id}>
                  <td>{i + 1}</td>
                  <td>{p.name}</td>
                  <td>{p.roll_number}</td>
                  <td>{p.actual_marks}</td>
                  <td>{p.predicted_marks}</td>
                  <td style={{ color: p.error >= 0 ? '#2e7d32' : '#c62828' }}>
                    {p.error >= 0 ? '+' : ''}{p.error}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AnalysisResult;
