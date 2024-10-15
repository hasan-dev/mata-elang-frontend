import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import axios from 'axios';
import { Card, Typography, Fab, Box, CircularProgress } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import Cookies from 'js-cookie';

const BarChartSensorId = ({ startDate, endDate }) => {
  const [dataResult, setDataResult] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const svgRef = useRef();
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

      const formattedData = response.data
        .map((item) => item._source)
        .filter((item) => {
          const timestamp = new Date(item['@timestamp']);
          return (
            timestamp >= new Date(startDate) && timestamp <= new Date(endDate)
          );
        });

      console.log(`Filtered data count: ${formattedData.length}`);
      setDataResult(formattedData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, accessToken]);

  useEffect(() => {
    console.log('BarChartSensorId: useEffect triggered');
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    console.log('BarChartSensorId: Updating chart');
    if (dataResult.length > 0 && !loading && !error) {
      updateChart();
    }
  }, [dataResult, loading, error]);

  const updateChart = () => {
    console.log('Updating chart with data:', dataResult);
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    if (dataResult.length === 0) {
      svg
        .append('text')
        .attr('x', 300)
        .attr('y', 200)
        .attr('text-anchor', 'middle')
        .text('No data available for the selected date range');
      return;
    }

    const sigIdCounts = dataResult.reduce((acc, item) => {
      acc[item.sensor_id] = (acc[item.sensor_id] || 0) + 1;
      return acc;
    }, {});

    const margin = { top: 20, right: 30, bottom: 60, left: 60 };
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

    const g = svg.append('g');

    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)');

    g.append('g')
      .attr('class', 'y-axis')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(null, 's'));

    g.selectAll('.bar')
      .data(Object.entries(sigIdCounts))
      .join('rect')
      .attr('class', 'bar')
      .attr('x', (d) => x(d[0]))
      .attr('y', (d) => y(d[1]))
      .attr('width', x.bandwidth())
      .attr('height', (d) => height - margin.bottom - y(d[1]))
      .attr('fill', '#69b3a2');

    svg
      .append('text')
      .attr('transform', `translate(${width / 2}, ${height + margin.top + 20})`)
      .style('text-anchor', 'middle')
      .text('Sensor ID');

    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - height / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text('Number of Alerts');
  };

  return (
    <Card>
      <Box
        sx={{
          display: 'flex',
          marginX: 4,
          alignItems: 'center',
          marginBottom: 2,
        }}
      >
        <Fab
          color='primary'
          aria-label='icon'
          sx={{ padding: 3 }}
          variant='extended'
        >
          <BarChartIcon color='white' />
        </Fab>
        <Typography
          sx={{ fontSize: 18, marginLeft: 2, fontWeight: 'bold' }}
          color='text.secondary'
          gutterBottom
        >
          Top sensors by alert count
        </Typography>
      </Box>
      {loading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 400,
          }}
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color='error' sx={{ p: 2 }}>
          Error loading data: {error.message}
        </Typography>
      ) : (
        <svg ref={svgRef} width='600' height='400'></svg>
      )}
    </Card>
  );
};

export default BarChartSensorId;
