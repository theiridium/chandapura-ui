"use client"
import { useCallback, useEffect, useRef, useState } from 'react';
import { Autocomplete, GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import geohash from 'ngeohash';

const libraries: any = ['places'];
const AddLocationMap = ({ setLocation, location, isExistingLoc }: any) => {
    // const [currentPosition, setCurrentPosition] = useState({ lat: 0, lng: 0 });
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.GOOGLE_MAP_API as string,
        libraries: libraries
    })
    const [center, setCenter] = useState(location.coordinates);
    const autocompleteRef = useRef<any>(null);

    const createPayload = (loc: any) => {
        const hash = geohash.encode(loc.lat, loc.lng);
        setLocation({
            geohash: hash,
            coordinates: loc
        });
    }

    useEffect(() => {
        if (!isExistingLoc && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                createPayload(userLocation);
                setCenter(userLocation);
            });
        }
        else setCenter(location.coordinates);
    }, [isLoaded, isExistingLoc]);

    const handleClick = useCallback((ev: google.maps.MapMouseEvent) => {
        const clickedLocation: any = {
            lat: ev.latLng?.lat(),
            lng: ev.latLng?.lng(),
        };
        createPayload(clickedLocation);
    }, [isLoaded]);

    // Handle place selection from Autocomplete
    const handlePlaceSelect = () => {
        const place = autocompleteRef.current.getPlace();
        if (place && place.geometry) {
            const newPosition = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
            };
            createPayload(newPosition);
            setCenter(newPosition); // Center map to selected place
        }
    };

    if (!isLoaded) return <div>Loading Map...</div>;

    return (
        <div className='relative'>
            <Autocomplete
                className='absolute top-2 left-2 z-10'
                onLoad={(autocomplete) => {
                    autocompleteRef.current = autocomplete;
                }}
                onPlaceChanged={handlePlaceSelect}
            >
                <input
                    type="text"
                    placeholder="Search for a place"
                    style={{
                        width: '300px',
                        height: '40px',
                        padding: '10px',
                    }}
                    className='border rounded-lg'
                />
            </Autocomplete>
            <GoogleMap
                mapContainerStyle={{ width: '100%', height: '400px' }}
                mapContainerClassName='google-map rounded-lg'
                center={center}
                zoom={20}
                onClick={handleClick}
                options={{
                    mapTypeControl: false,
                    streetViewControl: false,
                    draggableCursor: "pointer"
                }}>
                <Marker position={location.coordinates} />
            </GoogleMap>
        </div>
    );
}

export default AddLocationMap;