"use client";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";

// Custom bike icon for user location
const bikeIcon = new L.Icon({
  iconUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%230066ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>`,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
  className: "",
});

const restaurantIcon = new L.Icon({
  iconUrl: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyLjI1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXNvdXAtaWNvbiBsdWNpZGUtc291cCI+PHBhdGggZD0iTTEyIDIxYTkgOSAwIDAgMCA5LTlIM2E5IDkgMCAwIDAgOSA5WiIvPjxwYXRoIGQ9Ik03IDIxaDEwIi8+PHBhdGggZD0iTTE5LjUgMTIgMjIgNiIvPjxwYXRoIGQ9Ik0xNi4yNSAzYy4yNy4xLjguNTMuNzUgMS4zNi0uMDYuODMtLjkzIDEuMi0xIDIuMDItLjA1Ljc4LjM0IDEuMjQuNzMgMS42MiIvPjxwYXRoIGQ9Ik0xMS4yNSAzYy4yNy4xLjguNTMuNzQgMS4zNi0uMDUuODMtLjkzIDEuMi0uOTggMi4wMi0uMDYuNzguMzMgMS4yNC43MiAxLjYyIi8+PHBhdGggZD0iTTYuMjUgM2MuMjcuMS44LjUzLjc1IDEuMzYtLjA2LjgzLS45MyAxLjItMSAyLjAyLS4wNS43OC4zNCAxLjI0Ljc0IDEuNjIiLz48L3N2Zz4=`,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
  className: "",
});

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Extend the RoutingControlOptions to include createMarker
interface CustomRoutingOptions extends L.Routing.RoutingControlOptions {
  createMarker?: (
    i: number,
    wp: L.Routing.Waypoint,
    n: number
  ) => L.Marker | null;
}

interface MapProps {
  // latitude: number;
  // longitude: number;
  deliveryLocation:{latitude: number; longitude: number};
  driverLiveLocation:{latitude: number; longitude: number; timestamp: number};
  restLatitude: number;
  restLongitude: number;
}

export default function Map({
  // latitude,
  // longitude,
  deliveryLocation,
  driverLiveLocation,
  restLatitude,
  restLongitude,
}: MapProps) {
  const mapRef = useRef(null);
  const mapInstance = useRef<L.Map | null>(null);
  const routingControl = useRef<L.Routing.Control | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const destination: L.LatLngTuple = [deliveryLocation.latitude, deliveryLocation.longitude];
  const restaurant: L.LatLngTuple = [restLatitude, restLongitude];

  useEffect(() => {
 console.log("Driver live location updated:", driverLiveLocation);
  }, [driverLiveLocation]);

  // Initialize map only once
  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      const map = L.map(mapRef.current).setView([0, 0], 2);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);
      mapInstance.current = map;
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Update route and markers when location changes
useEffect(() => {
  if (!mapInstance.current || !driverLiveLocation) return;

  // Clear previous route and markers
  if (routingControl.current) {
    routingControl.current.getPlan().setWaypoints([]);
    mapInstance.current.removeControl(routingControl.current);
  }
  if (userMarkerRef.current) {
    mapInstance.current.removeLayer(userMarkerRef.current);
  }

  const driverLocation: [number, number] = [driverLiveLocation.latitude, driverLiveLocation.longitude];

  // Add driver location marker 
  userMarkerRef.current = L.marker(driverLocation, { icon: bikeIcon }).addTo(mapInstance.current);

  // Add restaurant marker with restaurant icon
  L.marker([restaurant[0], restaurant[1]], { icon: restaurantIcon }).addTo(
    mapInstance.current
  );

  // Add destination marker
  L.marker([destination[0], destination[1]]).addTo(mapInstance.current);

  // Routing options
  const routingOptions: CustomRoutingOptions = {
    waypoints: [
      L.latLng(driverLocation[0], driverLocation[1]),
      L.latLng(restaurant[0], restaurant[1]),
      L.latLng(destination[0], destination[1]),
    ],
    routeWhileDragging: false,
    show: false,
    addWaypoints: false,
    fitSelectedRoutes: true,
    createMarker: () => null,
    lineOptions: {
      styles: [{ color: "#0066ff", weight: 5 }],
      extendToWaypoints: true,
      missingRouteTolerance: 10,
    },
  };

  routingControl.current = L.Routing.control(routingOptions).addTo(
    mapInstance.current
  );

  // Fit map bounds
  mapInstance.current.fitBounds([driverLocation, restaurant, destination]);
}, [driverLiveLocation, deliveryLocation, restLatitude, restLongitude]);


  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
    </div>
  );
}
