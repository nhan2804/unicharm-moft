import { deleteBulkAnnoucement } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useDeleteBulkAnnoucement = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await deleteBulkAnnoucement(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['annoucements'])
    }
  });
};

export default useDeleteBulkAnnoucement;
