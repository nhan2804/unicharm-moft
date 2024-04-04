import { createRating } from "@modules/rating/services";
import { useMutation } from "react-query";

const useCreateNewRating = () => {
  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await createRating(formData);
      return data;
    },
  });
};

export default useCreateNewRating;
