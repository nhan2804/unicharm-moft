import { deleteImage } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useDeleteImage = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (_id) => {
      return await deleteImage(_id);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['images'])
    }
  });
};

export default useDeleteImage;
