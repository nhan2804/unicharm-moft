import { deleteDepartment } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useDeleteDepartment = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (_id) => {
      return await deleteDepartment(_id);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['departments'])
    }
  });
};

export default useDeleteDepartment;
