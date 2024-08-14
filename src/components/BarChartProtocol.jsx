import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Card, Typography, Fab, Box } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import Cookies from 'js-cookie';

const BarChartProtocol = () => {
  const svgRef = useRef();
  const [data, setData] = useState([]);
  const accessToken = Cookies.get('access_token');

  useEffect(() => {
    // Fetching data from the API
    fetch('http://127.0.0.1:8001/api/organizations/alert/all', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data.map((item) => item._source)); // Assuming data is directly under _source
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    if (data.length === 0) return; // Do nothing if data is not yet fetched

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear SVG content before drawing

    // Extracting the protocol values
    const protocols = data.map((item) => item.proto);

    // Counting occurrences of each protocol
    const protocolCounts = protocols.reduce((acc, protocol) => {
      acc[protocol] = (acc[protocol] || 0) + 1;
      return acc;
    }, {});

    // Define chart dimensions
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Create scales
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

    // Create axes
    const xAxis = (g) =>
      g
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickSizeOuter(0));

    const yAxis = (g) =>
      g
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(null, 's'))
        .call((g) => g.select('.domain').remove());

    // Append axes to the SVG
    svg.append('g').attr('class', 'x-axis').call(xAxis);
    svg.append('g').attr('class', 'y-axis').call(yAxis);

    // Create bars
    svg
      .selectAll('rect')
      .data(Object.entries(protocolCounts))
      .enter()
      .append('rect')
      .attr('x', (d) => x(d[0]))
      .attr('y', (d) => y(d[1]))
      .attr('width', x.bandwidth())
      .attr('height', (d) => y(0) - y(d[1]))
      .attr('fill', '#69b3a2');
  }, [data]); // Re-run this effect when 'data' changes

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
            Top Protocols used by Attackers
          </Typography>
        </Box>
        <svg ref={svgRef} width='600' height='400' />;
      </Card>
    </div>
  );
};

export default BarChartProtocol;
