import { updatePolicy } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useUpdatePolicy = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async ({_id,formData}) => {
      return await updatePolicy(_id,formData);
    },
    onSuccess:()=>{
      
      qc.invalidateQueries(['policys'])
    }
  });
};

export default useUpdatePolicy;
