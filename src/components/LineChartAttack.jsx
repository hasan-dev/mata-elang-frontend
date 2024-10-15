import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Cookies from 'js-cookie';

const LineChartAttack = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const accessToken = Cookies.get('access_token');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        'http://127.0.0.1:8001/api/organizations/alert/all',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonData = await response.json();
      const processedData = processData(jsonData);
      setData(processedData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again later.');
    }
  };

  const processData = (rawData) => {
    return rawData
      .map((item) => ({
        timestamp: item._source['@timestamp'] || new Date().toISOString(),
        count: item._source.count || 0,
        srcCountryCode: item._source.src_country_code || 'Unknown',
        srcLocation: item._source.src_location || { lat: 'N/A', lon: 'N/A' },
      }))
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  };

  const formatTooltipValue = (value, name, props) => {
    const { srcCountryCode, srcLocation } = props.payload;
    return [
      `Count: ${value}`,
      `Country: ${srcCountryCode}`,
      `Location: ${
        srcLocation.lat !== 'N/A'
          ? `${srcLocation.lat}, ${srcLocation.lon}`
          : 'N/A'
      }`,
    ];
  };

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '400px',
        backgroundColor: 'white',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h2 style={{ color: '#333', marginBottom: '20px', fontSize: '16px' }}>
        Attack Count Over Time
      </h2>
      <ResponsiveContainer width='100%' height='100%'>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray='3 3'
            stroke='#E0E0E0'
            vertical={false}
          />
          <XAxis
            dataKey='timestamp'
            stroke='#999'
            tick={{ fill: '#999', fontSize: 11 }}
            tickFormatter={(value) => new Date(value).toLocaleTimeString()}
            axisLine={{ stroke: '#E0E0E0' }}
          />
          <YAxis
            stroke='#999'
            tick={{ fill: '#999', fontSize: 11 }}
            axisLine={{ stroke: '#E0E0E0' }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #E0E0E0',
              borderRadius: '4px',
              fontSize: '12px',
            }}
            labelStyle={{ color: '#333' }}
            itemStyle={{ color: '#00A0B6' }}
            formatter={formatTooltipValue}
            labelFormatter={(label) =>
              `Time: ${new Date(label).toLocaleString()}`
            }
          />
          <Line
            type='monotone'
            dataKey='count'
            stroke='#00A0B6'
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#00A0B6' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartAttack;
