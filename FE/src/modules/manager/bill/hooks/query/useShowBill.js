import { showBill } from "@modules/bill/service";
import { useQuery } from "react-query";

const useShowBill = (billId) => {
  return useQuery(["bills", billId], async () => {
    return await showBill(billId);
  });
};

export default useShowBill;
