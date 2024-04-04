import { updateImage } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useUpdateImage = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async ({_id,formData}) => {
      return await updateImage(_id,formData);
    },
    onSuccess:()=>{
      
      qc.invalidateQueries(['images'])
    }
  });
};

export default useUpdateImage;
