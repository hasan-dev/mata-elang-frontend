import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  styled,
  tableCellClasses,
} from '@mui/material';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { VictoryPie } from 'victory';
import BarChartProtocol from './BarChartProtocol.jsx';
import BarChartSensorId from './BarChartSensorId.jsx';
import DataGridClassification from './DataGridClassification.jsx';
import DataGridSrcIP from './DataGridSrcIP.jsx';
import DataGridDstIP from './DataGridDstIP.jsx';
import CustomLineChart from './CustomLineChart.jsx';
import DataGridPriority from './DataGridPriority.jsx';
import DataGridAlertMsg from './DataGridAlertMsg.jsx';
import GaugeChart from './GaugeChart.jsx';
import BarChartDistributeAttack from './BarChartDistributeAttack.jsx';
import Map from './Map.jsx';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },

  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

const urlGateway = import.meta.env.VITE_URL_API_GATEWAY;
const urlSensor = import.meta.env.VITE_URL_API_SENSOR;

const ChartSensor = () => {
  const [sensorCounts, setSensorCounts] = useState({ active: 0, nonActive: 0 });
  const [organizationData, setOrganizationData] = useState([]);
  const accessToken = Cookies.get('access_token');
  const userId = Cookies.get('user_id');
  const organizationId = Cookies.get('organization_id');
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState('');
  const [data, setData] = useState([]);
  const [dataLog, setDataLog] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const colorScale = data.map((item) =>
    item.x === 'Active' ? 'green' : 'tomato'
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const columns = [
    { id: 'uuid', label: 'UUID' },
    { id: 'name', label: 'Name' },
    { id: 'isActive', label: 'isActive' },
    { id: 'last_seen', label: 'Last Seen' },
    { id: 'created_at', label: 'Created At' },
  ];

  const displayLog = () => {
    console.log(selectedOption);
    axios
      .get(`${urlSensor}/log/${organizationId}`)
      .then((response) => {
        setDataLog(response.data.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  useEffect(() => {
    axios
      .get(`${urlSensor}/test/${organizationId}`)
      .then((response) => {
        // console.log(response);
        setSensorCounts(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  useEffect(() => {
    console.log(organizationId);
    console.log(sensorCounts);
    const newData = [
      { x: 'Active', y: sensorCounts.active },
      { x: 'Deactive', y: sensorCounts.nonActive },
    ];

    const filteredData = newData.filter((item) => item.y !== 0);

    setData(filteredData);
  }, [sensorCounts]);

  return (
    <>
      <div style={{ paddingTop: 50 }}>
        <Box
          sx={{
            display: 'grid',
            columnGap: 2,
            rowGap: 1,
            gridTemplateColumns: '1fr 1fr',
            alignItems: 'stretch',
          }}
        >
          <Box sx={{ gridColumn: '1 / span 1' }}>
            <GaugeChart />;
          </Box>
          <Box sx={{ gridColumn: '2 / span 1' }}>
            <BarChartSensorId />;
          </Box>
        </Box>
      </div>

      {/* <div style={{ paddingTop: '50px' }}>
        <div style={{ fontSize: '20px' }}>Distribution Attack</div>
        <BarChartDistributeAttack />
      </div> */}
      <div style={{ paddingTop: '50px' }}>
        <BarChartProtocol />
      </div>
      <div style={{ paddingTop: '50px' }}>
        <div style={{ fontSize: '20px' }}>Top 10 Classification</div>
        <DataGridClassification />
      </div>
      <div style={{ paddingTop: '50px' }}>
        <div style={{ fontSize: '20px' }}>Top 10 Priority</div>
        <DataGridPriority />
      </div>
      <div style={{ paddingTop: '50px' }}>
        <div style={{ fontSize: '20px' }}>Top 10 Source IP Address</div>
        <DataGridSrcIP />
      </div>
      <div style={{ paddingTop: '50px' }}>
        <div style={{ fontSize: '20px' }}>Top 10 Destination IP Address</div>
        <DataGridDstIP />
      </div>
      <div style={{ paddingTop: '50px' }}>
        <div style={{ fontSize: '20px' }}>Top 20 Event Signature</div>
        <DataGridAlertMsg />
      </div>
      {/* <div style={{ paddingTop: '50px' }}>
        <div style={{ fontSize: '20px' }}>Top Source IP Address</div>
        <CustomLineChart />
      </div>
      <div style={{ paddingTop: '50px' }}>
        <div style={{ fontSize: '20px' }}>Top Destination Country</div>
        <Map />
      </div> */}

      <Box
        sx={{
          display: 'flex',
          bgcolor: 'background.paper',
          border: 1,
          borderColor: 'grey.500',
          flexDirection: 'column',
          justifyContent: 'center',
          alignContent: 'center',
          borderRadius: '16px',
          boxShadow: 3,
          mt: 10,
        }}
      >
        <Box
          sx={{
            padding: 3,
          }}
        >
          <Box>
            <Typography variant='h4'>Sensor Status Chart</Typography>
          </Box>
        </Box>

        <Box
          sx={{
            mx: 'auto',
            my: 0,
          }}
        >
          <VictoryPie
            data={data}
            colorScale={colorScale}
            width={500}
            labels={({ datum }) => `${datum.x}: ${datum.y}`}
            labelPosition='centroid'
            labelPlacement='vertical'
          />
        </Box>
        <Box
          sx={{
            padding: 2,
          }}
        >
          <Grid container spacing={2} direction='row'>
            <Grid item xs={2}>
              <Button variant='outlined' onClick={displayLog}>
                Show Log
              </Button>
            </Grid>
            <Grid item xs={8}>
              <Divider
                sx={{
                  px: 10,
                }}
              >
                <Chip label='Sensor Heartbeat Log' />
              </Divider>
            </Grid>
          </Grid>
        </Box>
        <Box
          sx={{
            padding: 3,
          }}
        >
          <TableContainer
            component={Paper}
            sx={{
              p: 2,
              minWidth: 900,
              alignContent: 'center',
            }}
          >
            <Table sx={{ minWidth: 700 }} aria-label='customized table'>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {dataLog
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow hover role='checkbox' tabIndex={-1} key={row.id}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id}>
                            {typeof value === 'number'
                              ? column.format(value)
                              : column.id === 'isActive'
                              ? value
                                ? 'Active'
                                : 'Non-Active'
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 100]}
            component='div'
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </Box>
    </>
  );
};

export default ChartSensor;
