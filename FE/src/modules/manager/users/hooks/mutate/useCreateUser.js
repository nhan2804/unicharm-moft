import { createUser } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useCreateUser = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await createUser(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['users'])
    }
  });
};

export default useCreateUser;
