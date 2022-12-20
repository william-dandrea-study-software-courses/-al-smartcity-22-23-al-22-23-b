import axios from "axios";

const proxyUrl = "http://localhost:6809/";

const carPosition = () => {
  const newLat = Math.random() * 10;
  const newLon = Math.random() * 10;

  return {
    licence_plate: "AA-123-AA",
    location: {
      lon: newLon,
      lat: newLat,
    },
    time: new Date().toISOString(),
  };
};

const startNavigation = () => {
  const body = carPosition();

  axios.get(`${proxyUrl}start`);
};

const stopNavigation = () => axios.get(`${proxyUrl}stop`);

export const NavigationService = {
  startNavigation,
  stopNavigation,
};
