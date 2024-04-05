import axios from "axios";
import queryString from "query-string";

export const getBills = async (query) => {
  const { data } = await axios.get(
    queryString.stringifyUrl({ url: `gift-clients/bill`, query })
  );
  return data;
};
export const getBillConsumer = async (query) => {
  const { data } = await axios.get(
    queryString.stringifyUrl({ url: `gift-clients/bill/consumer/history` })
  );
  return data;
};
export const showBill = async (billId) => {
  const { data } = await axios.get(`gift-clients/bill/${billId}`);
  return data;
};
export const createBill = async (input) => {
  const { data } = await axios.post("gift-clients/bill", input);
  return data;
};
export const updateBill = async (billId, input) => {
  const { data } = await axios.patch(`gift-clients/bill/${billId}`, input);
  return data;
};
export const deleteBill = async (billId) => {
  const { data } = await axios.delete(`gift-clients/bill/${billId}`);
  return data;
};
