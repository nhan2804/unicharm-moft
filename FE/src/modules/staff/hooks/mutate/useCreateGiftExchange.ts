import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { message } from "antd";
import { createGiftExchange } from "@modules/staff/services/gift-exchange";

const useCreateGiftExchange = (placeId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (formData) => {
      const data = createGiftExchange(placeId, formData);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries(["gift-exchanges", placeId]);
      message.success("Cập nhật thành công!");
    },
  });
};

export default useCreateGiftExchange;
