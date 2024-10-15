import React, { useState } from 'react';

const DateFilter = ({ onApply }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const handleApply = () => {
    onApply({
      start: new Date(startDate).toISOString(),
      end: new Date(endDate).toISOString(),
    });
    setIsExpanded(false);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      style={{
        width: '300px',
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontSize: '14px',
        border: '1px solid #D3DAE6',
        borderRadius: '4px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        background: '#FFF',
      }}
    >
      <div
        onClick={toggleExpand}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 12px',
          borderBottom: isExpanded ? '1px solid #D3DAE6' : 'none',
          background: '#F5F7FA',
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <svg
            width='16'
            height='16'
            viewBox='0 0 16 16'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            style={{ marginRight: '8px' }}
          >
            <path
              d='M12 2H4C2.89543 2 2 2.89543 2 4V12C2 13.1046 2.89543 14 4 14H12C13.1046 14 14 13.1046 14 12V4C14 2.89543 13.1046 2 12 2Z'
              stroke='#343741'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M2 6H14'
              stroke='#343741'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M6 3V5'
              stroke='#343741'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M10 3V5'
              stroke='#343741'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
          <span style={{ fontWeight: 'bold', color: '#343741' }}>
            {startDate} to {endDate}
          </span>
        </div>
        <svg
          width='16'
          height='16'
          viewBox='0 0 16 16'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d={isExpanded ? 'M4 10L8 6L12 10' : 'M4 6L8 10L12 6'}
            stroke='#343741'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </div>

      {isExpanded && (
        <div style={{ padding: '16px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                color: '#343741',
              }}
            >
              Start Date
            </label>
            <input
              type='date'
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #D3DAE6',
                borderRadius: '4px',
              }}
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                color: '#343741',
              }}
            >
              End Date
            </label>
            <input
              type='date'
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #D3DAE6',
                borderRadius: '4px',
              }}
            />
          </div>
          <button
            onClick={handleApply}
            style={{
              width: '100%',
              padding: '8px 12px',
              background: '#006BB4',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
};

export default DateFilter;
