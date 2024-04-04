import { getRating } from "@modules/rating/services";
import { useMutation } from "react-query";

const useGetRating = (query) => {
  return useMutation({
    mutationFn: async () => {
      const { data } = await getRating(query);
      return data;
    },
  });
};

export default useGetRating;
