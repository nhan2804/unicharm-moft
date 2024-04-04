import { createBulkAnnoucement } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useCreateBulkAnnoucement = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await createBulkAnnoucement(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['annoucements'])
    }
  });
};

export default useCreateBulkAnnoucement;
