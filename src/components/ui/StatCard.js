import "./StatCard.css";

function StatCard({ title, value, color = "primary", icon }) {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <span className="stat-icon">{icon}</span>
        <span className="stat-title">{title}</span>
      </div>

      <h2 className={`stat-value ${color}`}>
        {value}
      </h2>
    </div>
  );
}

export default StatCard;