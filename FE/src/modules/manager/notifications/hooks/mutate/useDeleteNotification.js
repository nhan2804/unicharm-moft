import { deleteNotification } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useDeleteNotification = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (_id) => {
      return await deleteNotification(_id);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['notifications'])
    }
  });
};

export default useDeleteNotification;
