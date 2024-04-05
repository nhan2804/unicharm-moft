import { useMutation, useQueryClient } from "react-query";
import { updateBill } from "../../service";

const useUpdateBill = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ _id, ...formData }) => {
      return await updateBill(_id, formData);
    },
    onSuccess: (data, vari) => {
      qc.invalidateQueries(["bills"]);
    },
  });
};

export default useUpdateBill;
