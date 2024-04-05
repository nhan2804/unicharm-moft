import axios from "axios";
import { useQuery } from "react-query";

const useShowGiftClients = (id) => {
  return useQuery(["gift-clients", id], async () => {
    const { data } = await axios.get(`gift-clients/${id}`);
    return data;
  });
};

export default useShowGiftClients;
