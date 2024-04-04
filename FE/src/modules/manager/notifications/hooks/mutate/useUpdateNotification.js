import { updateNotification } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useUpdateNotification = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async ({_id,formData}) => {
      return await updateNotification(_id,formData);
    },
    onSuccess:()=>{
      
      qc.invalidateQueries(['notifications'])
    }
  });
};

export default useUpdateNotification;
