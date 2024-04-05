import axios from "axios";
import { useQuery } from "react-query";

const useGetGiftClients = (query) => {
  return useQuery(["gift-clients", query], async () => {
    return await axios.get(`gift-clients`, { params: query });
  });
};

export default useGetGiftClients;
