import { deleteCheckin } from "@modules/manager/services/checkin";
import { useMutation, useQueryClient } from "react-query";

const useDeleteCheckin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const data = deleteCheckin(id);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries(["checkins"]);
    },
  });
};

export default useDeleteCheckin;
