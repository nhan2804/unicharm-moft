import { createBulkFormschema } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useCreateBulkFormschema = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await createBulkFormschema(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['formschemas'])
    }
  });
};

export default useCreateBulkFormschema;
