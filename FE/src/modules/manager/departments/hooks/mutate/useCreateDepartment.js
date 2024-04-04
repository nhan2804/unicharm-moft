import { createDepartment } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useCreateDepartment = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await createDepartment(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['departments'])
    }
  });
};

export default useCreateDepartment;
