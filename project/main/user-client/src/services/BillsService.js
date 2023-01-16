import axios from "axios";

const proxyUrl = "http://localhost:6802/";

function getBills(licensePlate) {
  return axios.get(`${proxyUrl}user-bills/${licensePlate}`);
}

const payBill = (licensePlate, billId) => {
  return axios.put(`${proxyUrl}pay-bill/${licensePlate}`, {"idBill": billId})
}

const payTicket = (licensePlate, id) => {
  return axios.put(`${proxyUrl}pay-ticket/${licensePlate}`, {"idTicket": id})
}

export const BillsService = {
  getBills,
  payBill,
  payTicket
};
