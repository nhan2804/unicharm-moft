import { useMutation, useQueryClient } from "react-query";
import { deleteBill } from "../../service";

const useDeleteBill = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (mutationData) => {
      return await deleteBill(mutationData);
    },
    onSuccess: (data, vari) => {
      qc.invalidateQueries(["bills"]);
    },
  });
};

export default useDeleteBill;
