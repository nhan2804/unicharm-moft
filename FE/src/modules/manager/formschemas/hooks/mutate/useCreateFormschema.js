import { createFormschema } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useCreateFormschema = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await createFormschema(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['formschemas'])
    }
  });
};

export default useCreateFormschema;
