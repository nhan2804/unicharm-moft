import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

const useCreateGiftClients = () => {
  return useMutation({
    mutationFn: async ({ formData }) => {
      const { data } = await axios.post(`gift-clients`, formData);
      return data;
    },
  });
};

export default useCreateGiftClients;
