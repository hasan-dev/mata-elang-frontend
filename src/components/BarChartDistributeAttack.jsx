import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Container } from '@mui/material';

function BarChartDistributeAttack() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8001/api/alert');
        const json = await response.json();

        // Create a mapping from src_addr to dst_addr with aggregation of bytes
        const trafficMap = json.reduce((acc, curr) => {
          const srcIP = curr._source.src_addr;
          const dstIP = curr._source.dst_addr;
          const bytes = curr._source.client_bytes;

          if (!acc[srcIP]) {
            acc[srcIP] = {};
          }
          if (!acc[srcIP][dstIP]) {
            acc[srcIP][dstIP] = 0;
          }
          acc[srcIP][dstIP] += bytes;
          return acc;
        }, {});

        // Convert to array suitable for charting
        const chartData = Object.entries(trafficMap).map(([srcIP, dstData]) => {
          return {
            srcIP,
            ...dstData,
          };
        });

        setData(chartData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Container style={{ backgroundColor: '#131722', padding: '20px' }}>
      <ResponsiveContainer width='100%' height={300}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id='colorTraffic' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor='#82ca9d' stopOpacity={0.8} />
              <stop offset='95%' stopColor='#82ca9d' stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey='srcIP' />
          <YAxis />
          <CartesianGrid strokeDasharray='3 3' />
          <Tooltip />
          {Object.keys(data[0] || {})
            .filter((key) => key !== 'srcIP')
            .map((key, index) => (
              <Area
                key={index}
                type='monotone'
                dataKey={key}
                stroke='#82ca9d'
                fillOpacity={1}
                fill='url(#colorTraffic)'
              />
            ))}
        </AreaChart>
      </ResponsiveContainer>
    </Container>
  );
}

export default BarChartDistributeAttack;
