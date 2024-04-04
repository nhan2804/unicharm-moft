import { createBulkDepartment } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useCreateBulkDepartment = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await createBulkDepartment(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['departments'])
    }
  });
};

export default useCreateBulkDepartment;
