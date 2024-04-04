import { updateAnnoucement } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useUpdateAnnoucement = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async ({_id,formData}) => {
      return await updateAnnoucement(_id,formData);
    },
    onSuccess:()=>{
      
      qc.invalidateQueries(['annoucements'])
    }
  });
};

export default useUpdateAnnoucement;
