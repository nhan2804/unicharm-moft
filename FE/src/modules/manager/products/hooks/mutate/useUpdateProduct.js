import { updateProduct } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useUpdateProduct = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async ({_id,formData}) => {
      return await updateProduct(_id,formData);
    },
    onSuccess:()=>{
      
      qc.invalidateQueries(['products'])
    }
  });
};

export default useUpdateProduct;
