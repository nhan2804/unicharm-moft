import { deleteBulkProduct } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useDeleteBulkProduct = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await deleteBulkProduct(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['products'])
    }
  });
};

export default useDeleteBulkProduct;
