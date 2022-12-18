import axios from "axios";

const proxyUrl = "http://localhost:6809/";

const startNavigation = () => axios.get(`${proxyUrl}/start`);

const stopNavigation = () => axios.get(`${proxyUrl}/stop`);

export const NavigationService = {
  startNavigation,
  stopNavigation,
};
