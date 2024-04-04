import { createQuestion } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useCreateQuestion = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await createQuestion(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['questions'])
    }
  });
};

export default useCreateQuestion;
