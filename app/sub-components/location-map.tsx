"use client"
import React, { useEffect, useRef } from 'react';
const LocationMap = () => {
  const mapRef: any = useRef(null);
  useEffect(() => {
    const googleMapsScript = document.createElement('script');
    googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API}`;
    googleMapsScript.async = true;
    googleMapsScript.defer = true;
    googleMapsScript.addEventListener('load', initializeMap);
    document.body.appendChild(googleMapsScript);
  }, []);
  const initializeMap = () => {
    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 37.7749, lng: -122.4194 }, // Default to San Francisco
      zoom: 12,
    });
    // Add your location-based features here
  };
  return (
    <div ref={mapRef} style={{ height: '400px', width: '100%' }}></div>
  );
};
export default LocationMap;