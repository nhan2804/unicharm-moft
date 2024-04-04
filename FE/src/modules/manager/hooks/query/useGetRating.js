import { fetchRating } from "@modules/manager/services/rating";
import { useQuery } from "react-query";

const useGetRating = (query) => {
  //   const { data: shifts, status } = useGetShift();
  //   const mappingShift = array2Object(shifts, "_id");
  return useQuery(["rating", query], async () => {
    const data = await fetchRating(query);
    // return data?.map((e) => {
    //   return { ...e, shift: mappingShift?.[e?.shiftId] };
    // });
    return data;
  });
};

export default useGetRating;
