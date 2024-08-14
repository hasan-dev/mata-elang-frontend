import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import Cookies from 'js-cookie';

const DataGridClassification = () => {
  const [classificationCounts, setClassificationCounts] = useState([]);
  const accessToken = Cookies.get('access_token');

  useEffect(() => {
    fetch('http://127.0.0.1:8001/api/organizations/alert/all', {
      method: 'GET', // or 'POST' if that's required
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const counts = countClassifications(data);
        setClassificationCounts(counts);
      })
      .catch((error) => {
        console.error('Error fetching data: ', error);
      });
  }, []);

  const countClassifications = (data) => {
    const classificationCounts = {};
    data.forEach((item) => {
      const classification = item._source.class;
      classificationCounts[classification] =
        (classificationCounts[classification] || 0) + 1;
    });
    const sortedCounts = Object.entries(classificationCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    return sortedCounts;
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>Classification</TableCell>
            <TableCell>Count</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {classificationCounts.map(([classification, count]) => (
            <TableRow key={classification}>
              <TableCell>{classification}</TableCell>
              <TableCell>{count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataGridClassification;
