import "../Styles/Dashboard.css";

const SummaryCard = ({ title, value, type, trend }) => {
  const getIcon = () => {
    switch (type) {
      case 'income': return '↑';
      case 'expense': return '↓';
      case 'savings': return '💰';
      default: return '$';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'income': return '#10B981';
      case 'expense': return '#EF4444';
      case 'savings': return '#F59E0B';
      default: return '#3B82F6';
    }
  };

  const getTrendColor = () => {
    return trend === 'up' ? '#10B981' : '#EF4444';
  };

  return (
    <div className="summary-card">
      <div className="card-icon" style={{ 
        backgroundColor: `${getColor()}20`, 
        color: getColor() 
      }}>
        {getIcon()}
      </div>
      <div className="card-content">
        <h4>{title}</h4>
        <p style={{ color: type === 'savings' ? getTrendColor() : getColor() }}>
          {value}
          {type !== 'savings' && (
            <span className="trend-indicator" style={{ color: getTrendColor() }}>
              {trend === 'up' ? '↑' : '↓'}
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default SummaryCard;