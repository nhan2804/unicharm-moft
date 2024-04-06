import axios from "axios";
import { useQuery } from "react-query";

const useGetGiftClients = (query) => {
  return useQuery(["gift-clients", query], async () => {
    const {data} = await axios.get(`gift-clients`, { params: query })
    return data;
  });
};

export default useGetGiftClients;
