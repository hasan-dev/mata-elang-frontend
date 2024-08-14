import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import axios from 'axios';
import { Card, Typography, Fab, Box } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import Cookies from 'js-cookie';

const BarChartSensorId = () => {
  const [dataResult, setDataResult] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const svgRef = useRef();
  const accessToken = Cookies.get('access_token');

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8001/api/organizations/alert/all', {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      })
      .then((response) => {
        const formattedData = response.data.map((item) => item._source); // Transform data to a usable format
        setDataResult(formattedData);
        console.log(dataResult);
        setLoading(false);

        // Start D3 rendering after data is loaded
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove(); // Clear previous SVG contents

        const sigIdCounts = formattedData.reduce((acc, item) => {
          acc[item.sensor_id] = (acc[item.sensor_id] || 0) + 1;
          return acc;
        }, {});

        const margin = { top: 20, right: 30, bottom: 30, left: 40 };
        const width = 600 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;
        const x = d3
          .scaleBand()
          .domain(Object.keys(sigIdCounts))
          .range([margin.left, width - margin.right])
          .padding(0.1);
        const y = d3
          .scaleLinear()
          .domain([0, d3.max(Object.values(sigIdCounts))])
          .range([height - margin.bottom, margin.top])
          .nice();

        svg
          .append('g')
          .attr('class', 'x-axis')
          .attr('transform', `translate(0,${height - margin.bottom})`)
          .call(d3.axisBottom(x).tickSizeOuter(0));

        svg
          .append('g')
          .attr('class', 'y-axis')
          .attr('transform', `translate(${margin.left},0)`)
          .call(d3.axisLeft(y).ticks(null, 's'));

        svg
          .selectAll('.bar')
          .data(Object.entries(sigIdCounts))
          .join('rect')
          .attr('class', 'bar')
          .attr('x', (d) => x(d[0]))
          .attr('y', (d) => y(d[1]))
          .attr('width', x.bandwidth())
          .attr('height', (d) => height - margin.bottom - y(d[1]))
          .attr('fill', '#69b3a2');
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  // Render
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
            Top sensor
          </Typography>
        </Box>
        {loading && <p>Loading...</p>}
        {error && <p>Error loading data: {error.message}</p>}
        {!loading && !error && (
          <svg ref={svgRef} width='600' height='400'></svg>
        )}
      </Card>
    </div>
  );
};

export default BarChartSensorId;
