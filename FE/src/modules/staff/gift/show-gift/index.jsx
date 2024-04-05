import { array2Object } from "@helper/array2Obj";
import useShowGiftClients from "@modules/comsumer/hooks/query/useShowGiftClients";
import useGetProduct from "@modules/manager/products/hooks/query/useGetProduct";
import React, { useMemo } from "react";
import { useParams } from "react-router";

const ShowGiftPage = () => {
  const { giftId } = useParams();
  const { data: gift } = useShowGiftClients(giftId);
  const { data: products } = useGetProduct();
  const productKeys = useMemo(
    () => array2Object(products?.data, "_id"),
    [products]
  );
  return (
    <>
      {gift &&
      (
        <div>
          Chúc mừng bạn nhận được{" "}
          {productKeys?.[Object.keys(gift?.products)?.[0]]?.name}
        </div>
      )}
    </>
  );
};

export default ShowGiftPage;
