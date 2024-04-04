import stringifyUrl from "@helper/stringifyUrl";
import axios from "axios";

export const getCheckInToday = async (placeId, query) => {
  const { data } = await axios.get(
    stringifyUrl({ url: `/stores/${placeId}/checkin/today`, query })
  );
  return data;
};
export const findAnnoucementByCheckin = async (checkinId, query) => {
  const { data } = await axios.get(
    stringifyUrl({ url: `/notifications/checkin/${checkinId}`, query })
  );
  return data;
};
export const getCheckInTodayForRating = async (placeId, query) => {
  const { data } = await axios.get(
    stringifyUrl({ url: `/stores/${placeId}/checkin/rating`, query })
  );
  return data;
};
export const getCheckIns = async (placeId, query) => {
  const { data } = await axios.get(
    stringifyUrl({ url: `/stores/${placeId}/checkin`, query })
  );
  return data;
};
export const overviewCheckin = async (placeId, query) => {
  const { data } = await axios.get(
    stringifyUrl({ url: `/stores/${placeId}/checkin/overview`, query })
  );
  return data;
};
export const overviewPolicy = async (query) => {
  const { data } = await axios.get(
    stringifyUrl({ url: `/ratings/policy/overview`, query })
  );
  return data;
};
export const showCheckin = async (placeId, checkinId, query) => {
  const { data } = await axios.get(
    stringifyUrl({ url: `/stores/${placeId}/checkin/${checkinId}`, query })
  );
  return data;
};
export const createCheckIn = async (placeId, formData) => {
  const { data } = await axios.post(`stores/${placeId}/checkin`, formData);
  return data;
};
