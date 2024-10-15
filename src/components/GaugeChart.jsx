import { useEffect, useState } from 'react';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { Card, Typography, Fab, Box } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import axios from 'axios';
import Cookies from 'js-cookie';

const GaugeChart = ({ startDate, endDate }) => {
  const [totalDataSources, setTotalDataSources] = useState(0);
  const accessToken = Cookies.get('access_token');

  useEffect(() => {
    // Fetch data from the API using axios
    axios
      .get('http://127.0.0.1:8001/api/organizations/alert/all', {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
        params: {
          start: startDate,
          end: endDate,
        },
      })
      .then((response) => {
        // Filter the data based on the date range
        const filteredData = response.data.filter((item) => {
          const timestamp = new Date(item._source['@timestamp']);
          return (
            timestamp >= new Date(startDate) && timestamp <= new Date(endDate)
          );
        });

        // Set the total number of data sources
        setTotalDataSources(filteredData.length);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, [startDate, endDate, accessToken]);

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
            Total number of attacks
          </Typography>
        </Box>
        <Gauge
          value={totalDataSources}
          max={10000} // Set max value to 10000
          startAngle={-110}
          endAngle={110}
          height={240}
          sx={{
            [`& .${gaugeClasses.valueText}`]: {
              fontSize: 40,
              transform: 'translate(0px, 0px)',
            },
          }}
          // Properly scale the text to the max value
          text={({ value }) => `${value} / 100`}
        />
      </Card>
    </div>
  );
};

export default GaugeChart;
