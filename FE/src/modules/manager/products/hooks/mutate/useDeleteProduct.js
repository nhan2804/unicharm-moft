import { deleteProduct } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useDeleteProduct = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (_id) => {
      return await deleteProduct(_id);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['products'])
    }
  });
};

export default useDeleteProduct;
