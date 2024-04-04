import { createReport } from "@modules/staff/services/report";
import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { TypeReport } from "../query/useGetReport";
import { message } from "antd";

const useCreateReport = (placeId: string, type: TypeReport) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (formData) => {
      const data = createReport(placeId, type, formData);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries(["report", placeId, type]);
      message.success("Cập nhật thành công!");
    },
  });
};

export default useCreateReport;
