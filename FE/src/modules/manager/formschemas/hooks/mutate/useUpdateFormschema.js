import { updateFormschema } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useUpdateFormschema = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async ({_id,formData}) => {
      return await updateFormschema(_id,formData);
    },
    onSuccess:()=>{
      
      qc.invalidateQueries(['formschemas'])
    }
  });
};

export default useUpdateFormschema;
