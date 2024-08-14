import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Cookies from 'js-cookie';

const DataGridDstIP = () => {
  const [dstIpCounts, setDstIpCounts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const accessToken = Cookies.get('access_token');

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8001/api/organizations/alert/all', {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      })
      .then((response) => {
        const data = response.data;
        const counts = {};
        data.forEach((item) => {
          const dstIp = item._source.dst_addr;
          if (dstIp) {
            counts[dstIp] = (counts[dstIp] || 0) + 1;
          }
        });

        const sortedDstIps = Object.entries(counts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10);

        setDstIpCounts(sortedDstIps);
        setTotalCount(data.length);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>Destination IP</TableCell>
            <TableCell>Count</TableCell>
            <TableCell>Percentage</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dstIpCounts.map(([dstIp, count]) => (
            <TableRow key={dstIp}>
              <TableCell>{dstIp}</TableCell>
              <TableCell>{count}</TableCell>
              <TableCell>{((count / totalCount) * 100).toFixed(2)}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataGridDstIP;
