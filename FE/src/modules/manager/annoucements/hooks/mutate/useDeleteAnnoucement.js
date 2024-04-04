import { deleteAnnoucement } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useDeleteAnnoucement = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (_id) => {
      return await deleteAnnoucement(_id);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['annoucements'])
    }
  });
};

export default useDeleteAnnoucement;
