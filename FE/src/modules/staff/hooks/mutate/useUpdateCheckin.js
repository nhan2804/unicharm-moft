import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

const useUpdateCheckIn = (placeId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await axios.patch(
        `/stores/${placeId}/checkin/${formData?._id}`,
        formData
      );
      return data;
    },
    onSuccess: () => {
      //   qc.invalidateQueries(["my-checkin", projectId, placeId]);
    },
  });
};

export default useUpdateCheckIn;
