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

const DataGridAlertMsg = () => {
  const accessToken = Cookies.get('access_token');
  const [alertMsgCounts, setAlertMsgCounts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

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
          const alertMsg = item._source.msg;
          if (alertMsg) {
            counts[alertMsg] = (counts[alertMsg] || 0) + 1;
          }
        });

        const sortedAlertMsgs = Object.entries(counts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 20);

        setAlertMsgCounts(sortedAlertMsgs);
        setTotalCount(data.length);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>Alert Message</TableCell>
            <TableCell>Count</TableCell>
            <TableCell>Percentage</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {alertMsgCounts.map(([alertMsg, count]) => (
            <TableRow key={alertMsg}>
              <TableCell>{alertMsg}</TableCell>
              <TableCell>{count}</TableCell>
              <TableCell>{((count / totalCount) * 100).toFixed(2)}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataGridAlertMsg;
