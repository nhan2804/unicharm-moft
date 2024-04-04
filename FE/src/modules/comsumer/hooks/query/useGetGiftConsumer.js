import { getGiftsHistory } from "@modules/gift/service";
import { useQuery } from "react-query";

const useGetGiftConsumer = (query) => {
  return useQuery(
    ["gifts-history", query],
    async () => {
      return await getGiftsHistory(query);
    },
    {}
  );
};

export default useGetGiftConsumer;
