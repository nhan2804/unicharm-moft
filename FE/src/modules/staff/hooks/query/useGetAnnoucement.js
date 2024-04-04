import { fetchAnnoucement } from "@modules/staff/services/annoucement";

import { useQuery } from "react-query";

const useGetAnnoucement = (placeId) => {
  return useQuery(["annoucements", placeId], async () => {
    const data = await fetchAnnoucement(placeId);
    return data;
  });
};

export default useGetAnnoucement;
