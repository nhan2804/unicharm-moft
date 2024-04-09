import { showProduct } from "../../services/index";
import { useQuery } from "react-query";

const useShowProduct = (query) => {
  return useQuery(
    ["detail-products", query],
    async () => {
      return await showProduct(query);
    },
    {
      enabled: !!query,
    }
  );
};

export default useShowProduct;
