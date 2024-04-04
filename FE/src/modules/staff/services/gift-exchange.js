import stringifyUrl from "@helper/stringifyUrl";
import axios from "axios";

export const createGiftExchange = async (placeId, formData) => {
  const { data } = await axios.post(
    `stores/${placeId}/gift-exchange`,
    formData
  );
  return data;
};
export const updateGiftExchange = async (placeId, id, formData) => {
  const { data } = await axios.patch(
    `stores/${placeId}/gift-exchange/${id}`,
    formData
  );
  return data;
};

export const getGiftExchange = async (placeId, query) => {
  const { data } = await axios.get(
    stringifyUrl({ url: `/stores/${placeId}/gift-exchange`, query })
  );
  return data;
};
export const getAllGiftExchangeToday = async (placeId, query) => {
  const { data } = await axios.get(
    stringifyUrl({ url: `/stores/${placeId}/gift-exchange/today`, query })
  );
  return data;
};
