import { useEffect, useState } from 'react';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { Card, Typography, Fab, Box } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import axios from 'axios';
import Cookies from 'js-cookie';

const GaugeChart = () => {
  const [totalDataSources, setTotalDataSources] = useState(0);
  const accessToken = Cookies.get('access_token');

  useEffect(() => {
    // Fetch data from the API using axios
    axios
      .get('http://127.0.0.1:8001/api/organizations/alert/all', {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      })
      .then((response) => {
        // Set the total number of data sources
        setTotalDataSources(response.data.length);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <Card>
        <Box sx={{ display: 'flex', marginX: 4 }}>
          <Fab
            color='primary'
            aria-label='icon'
            sx={{ padding: 3 }}
            variant='extended'
          >
            <BarChartIcon color='white' />
          </Fab>
          <Typography
            sx={{ fontSize: 18, marginLeft: 2, fontStyle: 'bold' }}
            color='text.secondary'
            gutterBottom
          >
            Total number of attack
          </Typography>
        </Box>
        <Gauge
          value={totalDataSources}
          startAngle={-110}
          endAngle={110}
          height={240}
          sx={{
            [`& .${gaugeClasses.valueText}`]: {
              fontSize: 40,
              transform: 'translate(0px, 0px)',
            },
          }}
          text={({ value, valueMax }) => `${value} / ${valueMax || 100}`}
        />
      </Card>
    </div>
  );
};

export default GaugeChart;
