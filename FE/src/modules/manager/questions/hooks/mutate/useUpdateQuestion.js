import { updateQuestion } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useUpdateQuestion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ _id, formData }) => {
      return await updateQuestion(_id, formData);
    },
    onSuccess: (_, vari) => {
      if (!vari?.noRefresh) {
        qc.invalidateQueries(["questions"]);
      }
    },
  });
};

export default useUpdateQuestion;
