import { deleteUser } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useDeleteUser = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (_id) => {
      return await deleteUser(_id);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['users'])
    }
  });
};

export default useDeleteUser;
