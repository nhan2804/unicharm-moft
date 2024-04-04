import { getBillConsumer } from "@modules/bill/service";
import { useQuery } from "react-query";

const useGetBillConsumer = (query) => {
  return useQuery(["bills-history"], async () => {
    return await getBillConsumer(query);
  });
};

export default useGetBillConsumer;
