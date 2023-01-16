import axios from "axios";

const proxyUrl = "http://localhost:6809/";

const generateRandomCoordinatesInParis = () => {
  // Coordonnées de bordures de Paris (rectangle)
  const minLat = 48.813;
  const maxLat = 48.905;
  const minLng = 2.224;
  const maxLng = 2.46;

  // Génération des coordonnées aléatoires
  const lat = minLat + Math.random() * (maxLat - minLat);
  const lng = minLng + Math.random() * (maxLng - minLng);

  return [lat, lng];
};

const arrivalCoord = generateRandomCoordinatesInParis();

function generatePosition(licensePlate) {
  const coords = generateRandomCoordinatesInParis();
  return {
    license_plate: `${licensePlate}`,
    location: {
      lon: coords[1],
      lat: coords[0],
    },
    time: new Date().toISOString(),
  };
}

const generateRoute = (licensePlate) => {
  const departureCoord = generateRandomCoordinatesInParis();
  return {
    license_plate: `${licensePlate}`,
    locationStart: {
      lon: departureCoord[1],
      lat: departureCoord[0],
    },
    locationEnd: {
      lon: arrivalCoord[1],
      lat: arrivalCoord[0],
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
