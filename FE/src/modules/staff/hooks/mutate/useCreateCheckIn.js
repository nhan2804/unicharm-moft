import { createCheckIn } from "@modules/staff/services/checkin";
import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

const useCreateCheckIn = (placeId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (formData) => {
      const data = createCheckIn(placeId, formData);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries(["my-checkin", placeId]);
    },
  });
};

export default useCreateCheckIn;
