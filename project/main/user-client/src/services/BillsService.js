import axios from "axios";

const proxyUrl = "http://localhost:6802/";

function getBills(licensePlate) {
  return axios.get(`${proxyUrl}user-bills/${licensePlate}`);
}

export const BillsService = {
  getBills,
};
