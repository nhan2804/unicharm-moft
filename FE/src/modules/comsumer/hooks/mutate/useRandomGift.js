import { useMutation } from "react-query";
import axios from "axios";
const useRandomGift = () => {
  return useMutation(
    async (formData) => {
      const { data } = await axios.post(`gifts/get`, formData);
      return data;
    },
    {
      retry: (retry, err) => {
        if (err?.response?.status === 400) return false;
        if (retry > 1) return false;
        return true;
      },
    }
  );
};
export default useRandomGift;
