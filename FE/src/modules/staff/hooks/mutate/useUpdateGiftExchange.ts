
import { useMutation, useQueryClient } from "react-query";
import { message } from "antd";
import { updateGiftExchange } from "@modules/staff/services/gift-exchange";
type FormData = {
  _id: string;
  formData: any;
};
const useUpdateGiftExchange = (placeId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ _id, formData }: FormData) => {
      const data = updateGiftExchange(placeId, _id, formData);
      return data;
    },
    // onMutate: () => {},
    onSuccess: async (data, _, context) => {
      // // Snapshot the previous value
      // const previousTodos = qc.getQueryData(["manager-report", type]);
      // console.log({ context });
      // qc.setQueryData(["manager-report", type], (old) => [
      //   ...(old || []),
      //   data,
      // ]);

      message.success("Cập nhật thành công!");
      // window.location.reload();
      qc.invalidateQueries(["gift-exchange-today", placeId]);
      qc.invalidateQueries(["gift-exchange", placeId]);
      // return { previousTodos };
    },
  });
};

export default useUpdateGiftExchange;
