import React, { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import {
  Box,
  Typography,
  useTheme,
  CircularProgress,
  Card,
} from '@mui/material';
import Cookies from 'js-cookie';

const MUIPieChart = ({ startDate, endDate }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const accessToken = Cookies.get('access_token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8001/api/organizations/alert/all?start=${startDate}&end=${endDate}`,
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

        // Filter the data based on the date range
        const filteredData = jsonData.filter((item) => {
          const timestamp = new Date(item._source['@timestamp']);
          return (
            timestamp >= new Date(startDate) && timestamp <= new Date(endDate)
          );
        });

        // Process the filtered data to count occurrences of each unique "msg"
        const msgCounts = filteredData.reduce((acc, item) => {
          const msg = item._source.msg;
          acc[msg] = (acc[msg] || 0) + 1;
          return acc;
        }, {});

        // Convert to array format for Recharts
        const chartData = Object.entries(msgCounts).map(([name, value]) => ({
          name,
          value,
        }));
        setData(chartData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(
          'Failed to fetch data. Please check your authentication and try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accessToken, startDate, endDate]);

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    theme.palette.success.main,
  ];

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color='error'>{error}</Typography>;
  }

  return (
    <Card style={{ padding: 20 }}>
      <Box sx={{ width: '100%', height: 500 }}>
        <Typography
          sx={{ fontSize: 18, marginLeft: 2, fontStyle: 'bold' }}
          gutterBottom
        >
          Top 20 Event Signature
        </Typography>
        <ResponsiveContainer width='100%' height='100%'>
          <PieChart>
            <Pie
              data={data}
              cx='50%'
              cy='50%'
              innerRadius='60%'
              outerRadius='80%'
              fill='#8884d8'
              dataKey='value'
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend layout='vertical' align='right' verticalAlign='middle' />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Card>
  );
};

export default MUIPieChart;
