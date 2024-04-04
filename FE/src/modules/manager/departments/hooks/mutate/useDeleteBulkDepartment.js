import { deleteBulkDepartment } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useDeleteBulkDepartment = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await deleteBulkDepartment(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['departments'])
    }
  });
};

export default useDeleteBulkDepartment;
