import { createReport, updateReport } from "@modules/staff/services/report";
import { useMutation, useQueryClient } from "react-query";
import { message } from "antd";
import { TypeReport } from "../query/useGetReport";
type FormData = {
  _id: string;
  formData: any;
};
const useUpdateReport = (placeId: string, type: TypeReport) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ _id, formData }: FormData) => {
      const data = updateReport(placeId, _id, formData);
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
      qc.invalidateQueries(["manager-report", type]);
      qc.invalidateQueries(["get-manager-report", type]);
      // return { previousTodos };
    },
  });
};

export default useUpdateReport;
