import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

const useUpdateGiftClients = () => {
  return useMutation({
    mutationFn: async ({ _id, formData }) => {
      const { data } = await axios.patch(`gift-clients/${_id}`, formData);
      return data;
    },
  });
};

export default useUpdateGiftClients;
