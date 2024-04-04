import { updateUser } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useUpdateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ _id, formData }) => {
      return await updateUser(_id, formData);
    },
    onSuccess: () => {
      qc.invalidateQueries(["users"]);
    },
  });
};

export default useUpdateUser;
