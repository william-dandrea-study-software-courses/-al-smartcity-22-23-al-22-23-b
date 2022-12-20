import axios from "axios";

const proxyUrl = "http://localhost:6809/";

const carPosition = () => {
  const newLat = Math.random() * 10;
  const newLon = Math.random() * 10;

  return {
    license_plate: "AA-123-AA",
    location: {
      lon: newLon,
      lat: newLat,
    },
    time: new Date().toISOString(),
  };
};

const startNavigation = () => {
  const positionBody = carPosition();
  axios.post(`${proxyUrl}start`, positionBody);
};

const stopNavigation = () => {
  const positionBody = carPosition();
  axios.post(`${proxyUrl}stop`, positionBody);
};

export const NavigationService = {
  startNavigation,
  stopNavigation,
};
