import { getManagerReport } from "@modules/manager/services/report";
import { AxiosError } from "axios";
import { useQuery } from "react-query";
import type {
  IReport,
  TypeReport,
} from "@modules/staff/hooks/query/useGetReport";
import useGetProduct from "@modules/manager/products/hooks/query/useGetProduct";
import { array2Object } from "@helper/array2Obj";
import useGetStore from "@modules/manager/stores/hooks/query/useGetStore";
import useGetUser from "@modules/manager/users/hooks/query/useGetUser";
import useGetShift from "@modules/staff/hooks/query/useGetShift";

const useGetReportManager = (type: TypeReport, query: object) => {
  return useQuery<IReport[], AxiosError>(
    ["get-manager-report", type, query],
    async () => {
      const data = await getManagerReport(type, query);
      // const finalData = data?.map((e: any) => {
      //   return {
      //     ...e,
      //     product: mappingProduct?.[e?.productId],
      //     store: mappingstore?.[e?.storeId],
      //   };
      // });
      return data;
    }
  );
};
const useManagerReport = (type: TypeReport, query: object) => {
  const { data: store, status: statusStore } = useGetStore();
  const { data: reports, status, isLoading } = useGetReportManager(type, query);
  const { data: users, status: statusUser } = useGetUser();
  const { data: shifts, status: statusShift } = useGetShift();

  const mappingstore = array2Object(store?.data, "_id");
  const mappingshifts = array2Object(shifts, "_id");
  const mappingUser = array2Object(users, "_id");
  // return {
  //   data: reports?.map((e) => ({
  //     ...e,
  //     store: mappingstore?.[e?.storeId],
  //     alo: true,
  //   })),
  // };
  const rs = useQuery<IReport[], AxiosError>(
    [
      `manager-report`,
      type,
      `${status}-${statusUser}-${statusStore}-${statusShift}`,

      query,
    ],
    async () => {
      return reports?.map((e) => ({
        ...e,
        store: mappingstore?.[e?.storeId],
        creator: mappingUser?.[e.updatorId || e?.creatorId],
        // updator: mappingUser?.[e.updatorId],
        shift: mappingshifts?.[e?.shiftId],
      }));
    }
  );
  return { ...rs, isLoading: isLoading };
};

export default useManagerReport;
