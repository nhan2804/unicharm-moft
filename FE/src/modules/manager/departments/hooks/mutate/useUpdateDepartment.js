import { updateDepartment } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useUpdateDepartment = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async ({_id,formData}) => {
      return await updateDepartment(_id,formData);
    },
    onSuccess:()=>{
      
      qc.invalidateQueries(['departments'])
    }
  });
};

export default useUpdateDepartment;
