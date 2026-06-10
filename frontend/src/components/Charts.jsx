import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Title, Tooltip, Legend
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

function ScatterChart({ students, xKey, xLabel, yKey, yLabel, color }) {
  const data = {
    datasets: [{
      label: `${xLabel} vs ${yLabel}`,
      data: students.map(s => ({ x: s[xKey], y: s[yKey] })),
      backgroundColor: color || 'rgba(46, 125, 50, 0.6)',
      pointRadius: 6,
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: `${xLabel} vs ${yLabel}` }
    },
    scales: {
      x: { title: { display: true, text: xLabel } },
      y: { title: { display: true, text: yLabel } }
    }
  };

  return <Scatter data={data} options={options} />;
}

function Charts({ students }) {
  if (!students || students.length < 2) {
    return (
      <div className="card">
        <div className="card-title">Charts</div>
        <div className="alert alert-info">Add at least 2 students to view charts.</div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-title">Charts</div>
      <div className="charts-grid">
        <div style={{ background: '#fff', border: '1px solid #ddd', padding: 12, borderRadius: 4 }}>
          <ScatterChart
            students={students}
            xKey="attendance" xLabel="Attendance (%)"
            yKey="final_marks" yLabel="Final Marks"
            color="rgba(46, 125, 50, 0.65)"
          />
        </div>
        <div style={{ background: '#fff', border: '1px solid #ddd', padding: 12, borderRadius: 4 }}>
          <ScatterChart
            students={students}
            xKey="study_hours" xLabel="Study Hours/Day"
            yKey="final_marks" yLabel="Final Marks"
            color="rgba(21, 101, 192, 0.65)"
          />
        </div>
        <div style={{ background: '#fff', border: '1px solid #ddd', padding: 12, borderRadius: 4 }}>
          <ScatterChart
            students={students}
            xKey="previous_gpa" xLabel="Previous GPA"
            yKey="final_marks" yLabel="Final Marks"
            color="rgba(198, 40, 40, 0.65)"
          />
        </div>
        <div style={{ background: '#fff', border: '1px solid #ddd', padding: 12, borderRadius: 4 }}>
          <ScatterChart
            students={students}
            xKey="assignment_marks" xLabel="Assignment Marks"
            yKey="final_marks" yLabel="Final Marks"
            color="rgba(230, 81, 0, 0.65)"
          />
        </div>
      </div>
    </div>
  );
}

export default Charts;
