import { useMutation, useQueryClient } from "react-query";
import { createBill } from "../../service";

const useCreateBill = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (formData) => {
      return await createBill(formData);
    },
    onSuccess: () => {
      qc.invalidateQueries(["bills"]);
    },
  });
};

export default useCreateBill;
