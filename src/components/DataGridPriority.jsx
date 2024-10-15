import React, { useState, useEffect, useCallback } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Cookies from 'js-cookie';

const DataGridPriority = ({ startDate, endDate }) => {
  const [priorityCounts, setPriorityCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const accessToken = Cookies.get('access_token');

  const fetchData = useCallback(async () => {
    console.log(`Fetching data for range: ${startDate} to ${endDate}`);
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        'http://127.0.0.1:8001/api/organizations/alert/all',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + accessToken,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      const filteredData = data.filter((item) => {
        const timestamp = new Date(item._source['@timestamp']);
        return (
          timestamp >= new Date(startDate) && timestamp <= new Date(endDate)
        );
      });

      const counts = filteredData.reduce((acc, item) => {
        const priority = item._source.priority;
        acc[priority] = (acc[priority] || 0) + 1;
        return acc;
      }, {});

      setPriorityCounts(counts);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, accessToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 300,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color='error' sx={{ p: 2 }}>
        Error loading data: {error.message}
      </Typography>
    );
  }

  const sortedPriorities = Object.entries(priorityCounts).sort(
    (a, b) => b[1] - a[1]
  ); // Sort by count in descending order

  return (
    <TableContainer component={Paper}>
      <Table aria-label='priority table'>
        <TableHead>
          <TableRow>
            <TableCell>Priority</TableCell>
            <TableCell align='right'>Count</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedPriorities.map(([priority, count]) => (
            <TableRow key={priority}>
              <TableCell component='th' scope='row'>
                {priority}
              </TableCell>
              <TableCell align='right'>{count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataGridPriority;
