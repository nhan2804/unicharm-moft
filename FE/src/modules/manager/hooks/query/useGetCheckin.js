import { array2Object } from "@helper/array2Obj";
import { fetchCheckIn } from "@modules/manager/services/checkin";
import useGetShift from "@modules/staff/hooks/query/useGetShift";
import { useQuery } from "react-query";

const useGetCheckin = (query) => {
  //   const { data: shifts, status } = useGetShift();
  //   const mappingShift = array2Object(shifts, "_id");
  return useQuery(["checkins", query], async () => {
    const data = await fetchCheckIn(query);
    // return data?.map((e) => {
    //   return { ...e, shift: mappingShift?.[e?.shiftId] };
    // });
    return data;
  });
};

export default useGetCheckin;
