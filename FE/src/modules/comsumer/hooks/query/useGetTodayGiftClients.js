import axios from "axios";
import { useQuery } from "react-query";

const useGetTodayGiftClients = (storeId, query) => {
  return useQuery(["gift-clients-today", storeId, query], async () => {
    const { data } = await axios.get(`gift-clients/store/${storeId}/today`, {
      params: query,
    });
    return data;
  });
};

export default useGetTodayGiftClients;
