"use client"
import React, { useEffect, useRef } from 'react';
const ViewLocationMap = ({coordinates}: any) => {
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
      center: { lat: coordinates.lat, lng: coordinates.lng }, // Default to San Francisco
      zoom: 20,
    });
    // Add your location-based features here
  };
  return (
    <div className='google-map' ref={mapRef} style={{ height: '400px', width: '100%' }}></div>
  );
};
export default ViewLocationMap;