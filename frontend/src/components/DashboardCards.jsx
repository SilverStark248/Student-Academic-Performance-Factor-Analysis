function DashboardCards({ stats }) {
  const cards = [
    { label: 'Total Students', value: stats.total_students },
    { label: 'Average Marks', value: stats.average_marks },
    { label: 'Highest Marks', value: stats.highest_marks },
    { label: 'Lowest Marks', value: stats.lowest_marks },
    { label: 'Avg. Attendance (%)', value: stats.average_attendance },
  ];

  return (
    <div className="stats-grid">
      {cards.map((c) => (
        <div className="stat-card" key={c.label}>
          <div className="stat-value">{c.value}</div>
          <div className="stat-label">{c.label}</div>
        </div>
      ))}
    </div>
  );
}

export default DashboardCards;
