import { getGiftExchange } from "@modules/staff/services/gift-exchange";
import { useQuery } from "react-query";

const useGetGiftExchange = (placeId, query) => {
  return useQuery(["gift-exchange", placeId, query], async () => {
    const data = await getGiftExchange(placeId, query);
    return data;
  });
};

export default useGetGiftExchange;
