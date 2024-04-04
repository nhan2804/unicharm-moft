import { array2Object } from "@helper/array2Obj";
import {
  fetchCheckIn,
  fetchImageByCheckIn,
} from "@modules/manager/services/checkin";
import { useMutation, useQuery } from "react-query";
import dayjs from "dayjs";
const useGetReportImageByCheckin = (formData) => {
  return useQuery({
    queryKey: ["get-image-report-by-checkin", formData],
    queryFn: async () => {
      const data = await fetchImageByCheckIn(formData);
      return data?.reduce((all, cur) => {
        const key = `${cur?.storeId}-${dayjs(cur?.createdAt).format(
          "DD/MM/YYYY"
        )}-${cur?.shiftId}`;
        all[key] = cur;
        return all;
      }, {});
      // return array2Object(data, "checkinId");
      // return data;
    },
    enabled: formData?.length > 0,
  });
};

export default useGetReportImageByCheckin;
