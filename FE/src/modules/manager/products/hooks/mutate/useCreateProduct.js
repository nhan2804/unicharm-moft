import { createProduct } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useCreateProduct = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await createProduct(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['products'])
    }
  });
};

export default useCreateProduct;
