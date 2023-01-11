import axios from "axios";

const proxyUrl = "http://localhost:6809/";

function generatePosition(licensePlate) {
  const newLat = Math.random() * 10;
  const newLon = Math.random() * 10;
  return {
    license_plate: `${licensePlate}`,
    location: {
      lon: newLon,
      lat: newLat,
    },
    time: new Date().toISOString(),
  };
}

function startNavigation(licensePlate) {
  const positionBody = generatePosition(licensePlate);
  return axios.post(`${proxyUrl}start`, positionBody);
}

function stopNavigation(licensePlate) {
  const positionBody = generatePosition(licensePlate);
  return axios.post(`${proxyUrl}stop`, positionBody);
}

function sendPosition(licensePlate) {
  const positionBody = generatePosition(licensePlate);
  return axios.post(`${proxyUrl}position-tracking`, positionBody);
}

export const NavigationService = {
  startNavigation,
  stopNavigation,
  sendPosition,
};
