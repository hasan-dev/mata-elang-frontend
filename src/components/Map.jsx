// Map.jsx
import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Map = () => {
  // Define your JSON data
  const jsonData = [
    {
      key: 'US',
      doc_count: 3309,
    },
    {
      key: 'ID',
      doc_count: 2387,
    },
    {
      key: 'SG',
      doc_count: 510,
    },
    {
      key: 'NL',
      doc_count: 234,
    },
    {
      key: 'JP',
      doc_count: 63,
    },
    {
      key: 'GB',
      doc_count: 28,
    },
    {
      key: 'FR',
      doc_count: 22,
    },
    {
      key: 'DE',
      doc_count: 13,
    },
    {
      key: 'IE',
      doc_count: 9,
    },
    {
      key: 'AU',
      doc_count: 8,
    },
  ];

  useEffect(() => {
    // Initialize Leaflet map
    const map = L.map('map').setView([0, 0], 2);

    // Add base layer from Natural Earth
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
    }).addTo(map);

    // Define colors for the map markers
    const colors = ['#ffeda0', '#feb24c', '#f03b20'];

    // Iterate over the JSON data and add markers to the map
    jsonData.forEach((country, index) => {
      L.circleMarker([Math.random() * 160 - 80, Math.random() * 360 - 180], {
        radius: Math.sqrt(country.doc_count) * 2,
        color: '#fff',
        weight: 1,
        fillColor: colors[index % colors.length],
        fillOpacity: 0.7,
      })
        .bindPopup(country.key + ': ' + country.doc_count)
        .addTo(map);
    });

    return () => {
      map.remove();
    };
  }, [jsonData]);

  return <div id='map' style={{ height: '500px' }} />;
};

export default Map;
