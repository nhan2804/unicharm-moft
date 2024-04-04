import stringifyUrl from "@helper/stringifyUrl";
import axios from "axios";

export const fetchCheckIn = async (query) => {
  const { data } = await axios.get(stringifyUrl({ url: `/checkin`, query }));
  return data;
};
export const fetchImageByCheckIn = async (formData) => {
  const { data } = await axios.post(
    stringifyUrl({ url: `/checkin/report-image` }),
    {
      ids: formData,
    }
  );
  return data;
};
export const fetchImageSupByCheckIn = async (formData) => {
  const { data } = await axios.post(
    stringifyUrl({ url: `/checkin/report-image-sup` }),
    {
      ids: formData,
    }
  );
  return data;
};
export const deleteCheckin = async (id) => {
  const { data } = await axios.delete(stringifyUrl({ url: `/checkin/${id}` }));
  return data;
};
