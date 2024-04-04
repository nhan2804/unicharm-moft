import { updateStore } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useUpdateStore = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async ({_id,formData}) => {
      return await updateStore(_id,formData);
    },
    onSuccess:()=>{
      
      qc.invalidateQueries(['stores'])
    }
  });
};

export default useUpdateStore;
