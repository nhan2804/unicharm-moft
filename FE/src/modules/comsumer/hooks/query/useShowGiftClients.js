import axios from "axios";
import { useQuery } from "react-query";

const useShowGiftClients = (id, options) => {
  return useQuery(
    ["gift-clients", id],
    async () => {
      const { data } = await axios.get(`gift-clients/${id}`);
      return data;
    },
    {
      refetchInterval: options?.refresh ? 1000 * 2 : false,
    }
  );
};

export default useShowGiftClients;
