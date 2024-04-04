import { createAnnoucement } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useCreateAnnoucement = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await createAnnoucement(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['annoucements'])
    }
  });
};

export default useCreateAnnoucement;
