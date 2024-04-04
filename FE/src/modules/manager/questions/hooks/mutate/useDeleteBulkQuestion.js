import { deleteBulkQuestion } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useDeleteBulkQuestion = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await deleteBulkQuestion(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['questions'])
    }
  });
};

export default useDeleteBulkQuestion;
