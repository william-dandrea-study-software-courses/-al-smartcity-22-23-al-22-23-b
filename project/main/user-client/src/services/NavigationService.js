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

const generateRoute = (licensePlate) => {
  const startLat = 48.856969;
  const startLon = 2.353771;
  const stopLat = 48.877678;
  const stopLon = 2.37066;
  return {
    license_plate: `${licensePlate}`,
    locationStart: {
      lon: startLon,
      lat: startLat,
    },
    locationEnd: {
      lon: stopLon,
      lat: stopLat,
    },
  };
};

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

const askRoute = (licensePlate) => {
  const routeBody = generateRoute(licensePlate);
  axios.post(`${proxyUrl}ask-route`, routeBody);
};

export const NavigationService = {
  startNavigation,
  stopNavigation,
  sendPosition,
  askRoute,
};
