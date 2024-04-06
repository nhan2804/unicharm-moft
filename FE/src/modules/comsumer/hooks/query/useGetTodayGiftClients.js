import axios from "axios";
import { useQuery } from "react-query";

const useGetTodayGiftClients = (storeId) => {
  return useQuery(["gift-clients-today", storeId], async () => {
    const { data } = await axios.get(`gift-clients/store/${storeId}/today`);
    return data;
  });
};

export default useGetTodayGiftClients;
