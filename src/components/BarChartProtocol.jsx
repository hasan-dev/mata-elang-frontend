import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { Card, Typography, Fab, Box, CircularProgress } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import Cookies from 'js-cookie';

const BarChartProtocol = ({ startDate, endDate }) => {
  const svgRef = useRef();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const accessToken = Cookies.get('access_token');

  const fetchData = useCallback(async () => {
    console.log(`Fetching data for range: ${startDate} to ${endDate}`);
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        'http://127.0.0.1:8001/api/organizations/alert/all',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + accessToken,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonData = await response.json();
      const filteredData = jsonData
        .map((item) => item._source)
        .filter((item) => {
          const timestamp = new Date(item['@timestamp']);
          return (
            timestamp >= new Date(startDate) && timestamp <= new Date(endDate)
          );
        });
      console.log(`Filtered data count: ${filteredData.length}`);
      setData(filteredData);
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

  const updateChart = useCallback(() => {
    if (data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const protocols = data.map((item) => item.proto);
    const protocolCounts = protocols.reduce((acc, protocol) => {
      acc[protocol] = (acc[protocol] || 0) + 1;
      return acc;
    }, {});

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const x = d3
      .scaleBand()
      .domain(Object.keys(protocolCounts))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(Object.values(protocolCounts))])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const g = svg.append('g');

    g.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)');

    g.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(null, 's'))
      .call((g) => g.select('.domain').remove());

    g.selectAll('rect')
      .data(Object.entries(protocolCounts))
      .join('rect')
      .attr('x', (d) => x(d[0]))
      .attr('y', (d) => y(d[1]))
      .attr('width', x.bandwidth())
      .attr('height', (d) => y(0) - y(d[1]))
      .attr('fill', '#69b3a2');

    svg
      .append('text')
      .attr('transform', `translate(${width / 2}, ${height + margin.top + 20})`)
      .style('text-anchor', 'middle')
      .text('Protocol');

    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - height / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text('Number of Occurrences');
  }, [data]);

  useEffect(() => {
    if (!loading && !error) {
      updateChart();
    }
  }, [updateChart, loading, error]);

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
          Top Protocols used by Attackers
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
        <svg ref={svgRef} width='600' height='400' />
      )}
    </Card>
  );
};

export default BarChartProtocol;
