import { updateGroupimage } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useUpdateGroupimage = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async ({_id,formData}) => {
      return await updateGroupimage(_id,formData);
    },
    onSuccess:()=>{
      
      qc.invalidateQueries(['groupimages'])
    }
  });
};

export default useUpdateGroupimage;
