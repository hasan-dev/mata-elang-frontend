import { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Cookies from 'js-cookie';

const DataGridSrcIP = () => {
  const [srcIpCounts, setSrcIpCounts] = useState([]);
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
          const srcIp = item._source.src_addr;
          if (srcIp) {
            counts[srcIp] = (counts[srcIp] || 0) + 1;
          }
        });

        const sortedSrcIps = Object.entries(counts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10);

        setSrcIpCounts(sortedSrcIps);
        setTotalCount(data.length);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>Source IP</TableCell>
            <TableCell>Count</TableCell>
            <TableCell>Percentage</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {srcIpCounts.map(([srcIp, count]) => (
            <TableRow key={srcIp}>
              <TableCell>{srcIp}</TableCell>
              <TableCell>{count}</TableCell>
              <TableCell>{((count / totalCount) * 100).toFixed(2)}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataGridSrcIP;
