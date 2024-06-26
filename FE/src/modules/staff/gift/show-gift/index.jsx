import { array2Object } from "@helper/array2Obj";
import useShowGiftClients from "@modules/comsumer/hooks/query/useShowGiftClients";
import useGetProduct from "@modules/manager/products/hooks/query/useGetProduct";
import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { Image, Card, Button } from "antd";
import CustomPageHeader from "@components/CustomPageHeader";
import imgSampling from "@assets/gift/sampling.jpg";
const ShowGiftPage = () => {
  const { giftId, storeId } = useParams();
  const { data: gift } = useShowGiftClients(giftId);
  const { data: products } = useGetProduct();
  const productKeys = useMemo(
    () => array2Object(products?.data, "_id"),
    [products]
  );
  const nav = useNavigate();
  return (
    <>
      {gift && (
        <>
          <CustomPageHeader title="Quà tặng" />
          <div className="flex flex-col items-center gap-5 m-3">
            <p>Chúc mừng khách hàng nhận được các phần quà sau!</p>
            <p>
              <b>Gói Silver spoon 40g</b> và <b>Gói Max Well 40g</b>
            </p>
            <Image src={imgSampling} />
            {/* {Object.keys(gift?.products)?.map((e, i) => (
              <Card
                title={`Quà tặng #${i + 1}`}
                bordered={false}
                style={{ width: 300 }}
              >
                <p>Tên sản phẩm: {productKeys?.[e]?.name}</p>
                <p>Số lượng: {gift?.products?.[e]}</p>
                <Image
                  width={200}
                  src={
                    productKeys?.[e]?.image ||
                    "https://www.verdict.co.uk/wp-content/uploads/2018/11/shutterstock_712915198-e1542045457155.jpg"
                  }
                />
              </Card>
            ))} */}
            <Button
              type="primary"
              className="font-bold"
              onClick={() =>
                nav(`/staff/stores/${storeId}/update-image/${giftId}`, {
                  replace: true,
                })
              }
            >
              Xác nhận
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default ShowGiftPage;
