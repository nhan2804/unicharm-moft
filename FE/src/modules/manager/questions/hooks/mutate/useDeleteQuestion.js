import { deleteQuestion } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useDeleteQuestion = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (_id) => {
      return await deleteQuestion(_id);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['questions'])
    }
  });
};

export default useDeleteQuestion;
