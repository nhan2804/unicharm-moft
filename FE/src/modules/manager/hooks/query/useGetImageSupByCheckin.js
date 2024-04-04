import { array2Object } from "@helper/array2Obj";
import {
  fetchCheckIn,
  fetchImageByCheckIn,
  fetchImageSupByCheckIn,
} from "@modules/manager/services/checkin";
import { useMutation, useQuery } from "react-query";
const useGetReportImageSupByCheckin = (formData) => {
  return useQuery({
    queryKey: ["get-image-sup-report-by-checkin", formData],
    queryFn: async () => {
      const data = await fetchImageSupByCheckIn(formData);
      return data?.reduce((all, cur) => {
        // const key = `${cur?.storeId}-${dayjs(cur?.createdAt).format(
        //   "DD/MM/YYYY"
        // )}-${cur?.shiftId}`;
        const key = cur?.checkinId;
        all[key] = cur;
        return all;
      }, {});
      // return array2Object(data, "checkinId");
      // return data;
    },
    enabled: formData?.length > 0,
  });
};

export default useGetReportImageSupByCheckin;
