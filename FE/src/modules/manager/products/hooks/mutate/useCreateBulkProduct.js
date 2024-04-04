import { createBulkProduct } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useCreateBulkProduct = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await createBulkProduct(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['products'])
    }
  });
};

export default useCreateBulkProduct;
