import { getAllGiftExchangeToday } from "@modules/staff/services/gift-exchange";
import { useQuery } from "react-query";

const useGetAllGiftExchangeToday = (placeId, query) => {
  return useQuery(["gift-exchange-today", placeId, query], async () => {
    const data = await getAllGiftExchangeToday(placeId, query);
    return data;
  });
};

export default useGetAllGiftExchangeToday;
