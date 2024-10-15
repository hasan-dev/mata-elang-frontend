import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
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

const DataGridAlertMsg = ({ startDate, endDate }) => {
  const [alertMsgCounts, setAlertMsgCounts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const accessToken = Cookies.get('access_token');

  const fetchData = useCallback(async () => {
    console.log(`Fetching data for range: ${startDate} to ${endDate}`);
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        'http://127.0.0.1:8001/api/organizations/alert/all',
        {
          headers: {
            Authorization: 'Bearer ' + accessToken,
          },
          params: {
            start: startDate,
            end: endDate,
          },
        }
      );

      const filteredData = response.data.filter((item) => {
        const timestamp = new Date(item._source['@timestamp']);
        return (
          timestamp >= new Date(startDate) && timestamp <= new Date(endDate)
        );
      });

      const counts = {};
      filteredData.forEach((item) => {
        const alertMsg = item._source.msg;
        if (alertMsg) {
          counts[alertMsg] = (counts[alertMsg] || 0) + 1;
        }
      });

      const sortedAlertMsgs = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20);

      setAlertMsgCounts(sortedAlertMsgs);
      setTotalCount(filteredData.length);
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

  return (
    <TableContainer component={Paper}>
      <Table aria-label='alert message table'>
        <TableHead>
          <TableRow>
            <TableCell>Alert Message</TableCell>
            <TableCell align='right'>Count</TableCell>
            <TableCell align='right'>Percentage</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {alertMsgCounts.map(([alertMsg, count]) => (
            <TableRow key={alertMsg}>
              <TableCell component='th' scope='row'>
                {alertMsg}
              </TableCell>
              <TableCell align='right'>{count}</TableCell>
              <TableCell align='right'>
                {totalCount > 0
                  ? ((count / totalCount) * 100).toFixed(2)
                  : '0.00'}
                %
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataGridAlertMsg;
