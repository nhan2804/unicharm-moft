import { createBulkQuestion } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useCreateBulkQuestion = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await createBulkQuestion(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['questions'])
    }
  });
};

export default useCreateBulkQuestion;
