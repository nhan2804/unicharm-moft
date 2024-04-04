import { getProduct } from "../../services/index";
import { useQuery } from "react-query";
interface IQueryProduct {
  isGiftExchange?: Boolean;
  isSale?: Boolean;
  isGift?: Boolean;
  isSampling?: Boolean;
  isGiftExternal?: Boolean;
  isOos?: Boolean;
}

export const typeOfProduct = [
  {
    label: "Số bán",
    name: "isSale",
  },
  {
    label: "OOS",
    name: "isOos",
  },
  {
    label: "Đổi quà",
    name: "isGiftExchange",
  },

  {
    label: "Quà tặng",
    name: "isGift",
  },
  {
    label: "Quà ngoài",
    name: "isGiftExternal",
  },
  {
    label: "Sampling",
    name: "isSampling",
  },
];
const useGetProduct = (query?: IQueryProduct) => {
  return useQuery({
    queryKey: ["products", query],
    queryFn: async () => {
      const data = await getProduct(query);
      return { data };
    },
    refetchOnMount: false,

    cacheTime: 1000 * 60 * 60 * 24,
  });
};

export default useGetProduct;
