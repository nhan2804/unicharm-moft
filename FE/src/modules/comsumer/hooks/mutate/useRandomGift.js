import { useMutation } from "react-query";
import axios from "axios";
const useRandomGift = (id) => {
  return useMutation(
    async (formData) => {
      const { data } = await axios.post(`gift-clients/roll/${id}`, formData);
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
