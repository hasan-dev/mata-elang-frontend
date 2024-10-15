import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Cookies from 'js-cookie';
import { Box, Typography, CircularProgress, Card, Alert } from '@mui/material';

const MapSourceAttack = ({ startDate, endDate }) => {
  const [countries, setCountries] = useState(null);
  const [sourceCountryData, setSourceCountryData] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const accessToken = Cookies.get('access_token');
  const mapRef = useRef(null);

  const fetchData = useCallback(async () => {
    console.log(`Fetching data for range: ${startDate} to ${endDate}`);
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        'http://127.0.0.1:8001/api/organizations/alert/all',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      console.log('API Response:', data);

      if (!Array.isArray(data)) {
        throw new Error('API did not return an array');
      }

      const filteredData = data.filter((item) => {
        const timestamp = new Date(item._source['@timestamp']);
        return (
          timestamp >= new Date(startDate) && timestamp <= new Date(endDate)
        );
      });

      const aggregatedData = filteredData.reduce((acc, item) => {
        if (item && item._source && item._source.src_country_code) {
          const countryCode = item._source.src_country_code;
          acc[countryCode] = (acc[countryCode] || 0) + 1;
        }
        return acc;
      }, {});
      console.log('Aggregated Data:', aggregatedData);
      setSourceCountryData(aggregatedData);

      // Fetch GeoJSON data
      const geoResponse = await fetch(
        'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson'
      );
      const geoData = await geoResponse.json();

      // Add the count data to each feature
      geoData.features = geoData.features.map((feature) => {
        const countryCode = feature.properties.ISO_A2;
        feature.properties.count = aggregatedData[countryCode] || 0;
        return feature;
      });
      setCountries(geoData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate, accessToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getColor = useCallback((count) => {
    if (count === 0) return 'white';
    return count > 1000
      ? '#800026'
      : count > 500
      ? '#BD0026'
      : count > 200
      ? '#E31A1C'
      : count > 100
      ? '#FC4E2A'
      : count > 50
      ? '#FD8D3C'
      : count > 20
      ? '#FEB24C'
      : count > 10
      ? '#FED976'
      : '#FFEDA0';
  }, []);

  const style = useCallback(
    (feature) => {
      const count = feature.properties.count || 0;
      return {
        fillColor: getColor(count),
        weight: 1,
        opacity: 1,
        color: 'gray',
        fillOpacity: count > 0 ? 0.7 : 0.1,
      };
    },
    [getColor]
  );

  const highlightFeature = useCallback((e) => {
    const layer = e.target;
    layer.setStyle({
      weight: 3,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7,
    });
    layer.bringToFront();
    updateHoverInfo(layer.feature.properties);
  }, []);

  const resetHighlight = useCallback(
    (e) => {
      const layer = e.target;
      layer.setStyle(style(layer.feature));
      updateHoverInfo(null);
    },
    [style]
  );

  const updateHoverInfo = useCallback((props) => {
    const infoControl = L.DomUtil.get('hover-info');
    if (infoControl) {
      if (props) {
        console.log(
          'Hover country:',
          props.ADMIN,
          'ISO_A2:',
          props.ISO_A2,
          'Count:',
          props.count
        );
        infoControl.innerHTML = `
          <h4>${props.ADMIN}</h4>
          <p>Source Count: ${props.count || 0}</p>
        `;
        infoControl.style.display = 'block';
      } else {
        infoControl.style.display = 'none';
      }
    }
  }, []);

  const onEachFeature = useCallback(
    (feature, layer) => {
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
      });
    },
    [highlightFeature, resetHighlight]
  );

  if (isLoading) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        height={500}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        height={500}
      >
        <Alert severity='error'>{error}</Alert>
      </Box>
    );
  }

  return (
    <Card style={{ padding: 20 }}>
      <Box sx={{ width: '100%', height: 500 }}>
        <Typography
          sx={{
            fontSize: 18,
            marginLeft: 2,
            fontWeight: 'bold',
            marginBottom: 2,
          }}
        >
          Source Attack
        </Typography>
        <div style={{ position: 'relative', height: '500px', width: '100%' }}>
          <div
            id='hover-info'
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              zIndex: 1000,
              backgroundColor: 'white',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              display: 'none',
            }}
          ></div>
          <MapContainer
            ref={mapRef}
            center={[20, 0]}
            zoom={2}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {countries && (
              <GeoJSON
                key={JSON.stringify(sourceCountryData)}
                data={countries}
                style={style}
                onEachFeature={onEachFeature}
              />
            )}
          </MapContainer>
        </div>
      </Box>
    </Card>
  );
};

export default MapSourceAttack;
