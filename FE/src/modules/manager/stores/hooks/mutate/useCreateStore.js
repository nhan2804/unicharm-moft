import { createStore } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useCreateStore = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await createStore(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['stores'])
    }
  });
};

export default useCreateStore;
