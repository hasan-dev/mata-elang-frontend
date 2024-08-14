import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Cookies from 'js-cookie';

const DataGridPriority = () => {
  const [priorityCounts, setPriorityCounts] = useState({});
  const accessToken = Cookies.get('access_token');

  useEffect(() => {
    fetch('http://127.0.0.1:8001/api/organizations/alert/all', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const counts = {};
        data.forEach((item) => {
          const priority = item._source.priority;
          counts[priority] = (counts[priority] || 0) + 1;
        });
        setPriorityCounts(counts);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table aria-label='priority table'>
        <TableHead>
          <TableRow>
            <TableCell>Priority</TableCell>
            <TableCell>Count</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(priorityCounts).map((priority) => (
            <TableRow key={priority}>
              <TableCell>{priority}</TableCell>
              <TableCell>{priorityCounts[priority]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataGridPriority;
