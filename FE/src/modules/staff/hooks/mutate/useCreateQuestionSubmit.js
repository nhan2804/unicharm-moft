import { createQuestionSubmit } from "@modules/staff/services/quesiton-submit";
import { message } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router";

const useCreateQuestionSubmit = () => {
  const qc = useQueryClient();
  const nav = useNavigate();
  return useMutation({
    mutationFn: async (formData) => {
      const data = createQuestionSubmit(formData);
      return data;
    },
    onSuccess: async () => {
      qc.invalidateQueries(["question-today"]);
      message.success("Trả lời thành công");

      await new Promise((resolve) => setTimeout(resolve, 1000));
      nav("/staff");
    },
  });
};

export default useCreateQuestionSubmit;
