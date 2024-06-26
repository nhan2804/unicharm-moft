import axios from "axios";
import { useQuery } from "react-query";

const useGetGiftClients = (query) => {
  return useQuery(["gift-clients", query], async () => {
    const { data } = await axios.get(`gift-clients`, { params: query });
    const { data: d, paginate } = data;
    const modifiedData = d?.map((e) => {
      const productsBill = e?.productsBill?.reduce((all, c) => {
        all[c?.product] = c?.quantity;
        return all;
      }, {});
      return {
        ...e,
        productsBill,
      };
    });
    return { data: modifiedData, paginate };
  });
};

export default useGetGiftClients;
