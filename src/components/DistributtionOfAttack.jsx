import React, { useState, useEffect, useCallback } from 'react';
import { ResponsiveSankey } from '@nivo/sankey';
import axios from 'axios';
import Cookies from 'js-cookie';
import {
  Card,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Divider,
} from '@mui/material';

const DistributionOfAttack = ({ startDate, endDate }) => {
  const [sankeyData, setSankeyData] = useState({ nodes: [], links: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const accessToken = Cookies.get('access_token');

  const fetchData = useCallback(async () => {
    console.log(`Fetching data for range: ${startDate} to ${endDate}`);
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        'http://127.0.0.1:8001/api/organizations/alert/all',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            start: startDate,
            end: endDate,
          },
        }
      );
      const data = response.data.filter((item) => {
        const timestamp = new Date(item._source['@timestamp']);
        return (
          timestamp >= new Date(startDate) && timestamp <= new Date(endDate)
        );
      });

      // Process the data
      const nodeMap = new Map();
      const linkMap = new Map();

      data.forEach((item) => {
        const source = item._source.src_addr;
        const target = item._source.dst_addr;

        if (source === target) return; // Skip self-links

        if (!nodeMap.has(source))
          nodeMap.set(source, { id: source, color: getRandomColor() });
        if (!nodeMap.has(target))
          nodeMap.set(target, { id: target, color: getRandomColor() });

        const forwardKey = `${source}-${target}`;
        const backwardKey = `${target}-${source}`;

        if (linkMap.has(forwardKey)) {
          linkMap.set(forwardKey, {
            ...linkMap.get(forwardKey),
            value: linkMap.get(forwardKey).value + 1,
          });
        } else if (linkMap.has(backwardKey)) {
          linkMap.set(backwardKey, {
            ...linkMap.get(backwardKey),
            value: linkMap.get(backwardKey).value + 1,
          });
        } else {
          linkMap.set(forwardKey, { source, target, value: 1 });
        }
      });

      // Ensure source and target are in alphabetical order to prevent circular links
      const processedLinks = Array.from(linkMap.values()).map((link) => {
        if (link.source > link.target) {
          return {
            source: link.target,
            target: link.source,
            value: link.value,
          };
        }
        return link;
      });

      setSankeyData({
        nodes: Array.from(nodeMap.values()),
        links: processedLinks,
      });
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate, accessToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getRandomColor = () => {
    const colors = [
      '#7eb26d',
      '#eab839',
      '#6ed0e0',
      '#ef843c',
      '#e24d42',
      '#1f78c1',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  if (isLoading) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        height='500px'
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity='error' sx={{ mt: 2 }}>
        Error loading data: {error}
      </Alert>
    );
  }

  return (
    <Card sx={{ height: 550, p: 2, display: 'flex', flexDirection: 'column' }}>
      <Typography variant='h6' gutterBottom>
        Distribution of Attacks
      </Typography>
      {sankeyData.nodes.length > 0 ? (
        <>
          <Box flex={1} minHeight={0}>
            <ResponsiveSankey
              data={sankeyData}
              margin={{ top: 40, right: 120, bottom: 40, left: 120 }}
              align='justify'
              colors={(node) => node.color}
              nodeOpacity={1}
              nodeThickness={18}
              nodeInnerPadding={3}
              nodeSpacing={20}
              nodeBorderWidth={0}
              linkOpacity={0.8}
              linkHoverOthersOpacity={0.1}
              enableLinkGradient={true}
              labelPosition='outside'
              labelOrientation='horizontal'
              labelPadding={16}
              labelTextColor={{ from: 'color', modifiers: [['darker', 1]] }}
            />
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box
            display='flex'
            justifyContent='space-between'
            alignItems='center'
            px={10}
          >
            <Typography variant='body1' fontWeight='bold'>
              Source
            </Typography>
            <Typography variant='body1' fontWeight='bold'>
              Destination
            </Typography>
          </Box>
        </>
      ) : (
        <Box
          display='flex'
          justifyContent='center'
          alignItems='center'
          flex={1}
        >
          <Typography variant='body1'>
            No data available for the selected date range.
          </Typography>
        </Box>
      )}
    </Card>
  );
};

export default DistributionOfAttack;
