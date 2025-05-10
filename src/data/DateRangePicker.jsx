import React from 'react';

const DateRangePicker = ({ range, onChange }) => {
  const formatDateForInput = (date) => {
    return date.toISOString().split('T')[0];
  };

  const handleStartDateChange = (e) => {
    onChange({ ...range, start: new Date(e.target.value) });
  };

  const handleEndDateChange = (e) => {
    onChange({ ...range, end: new Date(e.target.value) });
  };

  return (
    <div className="date-range-picker">
      <label>
        Start Date:
        <input
          type="date"
          value={formatDateForInput(range.start)}
          onChange={handleStartDateChange}
          max={formatDateForInput(range.end)}
        />
      </label>
      <label>
        End Date:
        <input
          type="date"
          value={formatDateForInput(range.end)}
          onChange={handleEndDateChange}
          min={formatDateForInput(range.start)}
        />
      </label>
    </div>
  );
};

export default DateRangePicker;