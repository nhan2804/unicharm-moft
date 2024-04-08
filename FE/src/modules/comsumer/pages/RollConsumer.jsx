import { Button, Card, Form, Result, Modal, theme, Skeleton } from "antd";
import classNames from "classnames";
import React, { Suspense, lazy, useRef, useState } from "react";
import { useEffect } from "react";
import useRandomGift from "../hooks/mutate/useRandomGift";
import useGetProfile from "@modules/auth/hooks/useGetProfile";
import { useNavigate } from "react-router";
import { useQueryClient } from "react-query";
import useQueryString2 from "@hooks/useQueryString2";
import spin1 from "@assets/spin.png";
import spin2 from "@assets/spin2.png";
import { useCallback } from "react";
import { isSafari } from "react-device-detect";
import { useParams } from "react-router";
import useShowGiftClients from "../hooks/query/useShowGiftClients";
import CustomSkeleton from "@components/CustomSkeleton";

import useGetProduct from "@modules/manager/products/hooks/query/useGetProduct";
const CustomWheel = lazy(() => import("../components/Wheel"));

const { useToken } = theme;
const RollConsumer = () => {
  const isF = isSafari;
  const [mustSpin, setMustSpin] = useState(false);
  // useEffect(() => {
  //   // if (isF) {
  //   const el = document.querySelector(".roulette-container");
  //   // el.offsetHeight = el.offsetWidth;
  //   if (el) {
  //     el.style.width = "330px";
  //     el.style.height = "330px";
  //   }
  //   // }
  // });

  const qs = useQueryString2();
  const parsed = qs.qsParsed2;

  const delay = parsed?.delay || undefined;
  const { id } = useParams();
  const { mutate: random, isLoading, data: dataRandom } = useRandomGift(id);
  const { data: user } = useGetProfile();
  const nav = useNavigate();
  const qc = useQueryClient();
  const onFinish = useCallback(() => {
    random(
      { delay },
      {
        onSuccess: (data) => {
          // toast.dismiss();

          setMustSpin(true);
          return;
        },
      }
    );
  }, [delay, random]);

  const point = user?.point;
  const handleSpinClick = useCallback(() => {
    if (!isLoading) {
      console.log("start spin");
      onFinish();
    }
  }, [onFinish, isLoading]);

  const onEndWheel = async () => {
    // qc.cancelQueries(["userProfile"]);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 3 sec
    alert(`OTP của bạn là ` + dataRandom?.code);
    return;
    Modal.success({
      centered: true,

      title: "Quay thành công",
      content: (
        <div>
          <p className="text-xl">
            {dataRandom?.final !== "goodluck"
              ? `Chúc mừng bạn đã trúng thẻ cào điện thoại ${dataRandom?.final}.000đ, vui lòng vào lịch sử trúng thưởng để sử dụng`
              : "Chúc bạn may mắn lần sau"}
          </p>
        </div>
      ),
      okText: "Xem lịch trúng thưởng",
      cancelText: "Ở lại",
      onOk: () => {
        nav(`/consumer/history`);
      },
      onCancel: () => {
        window.location.reload();
        // close?.();
      },
      closable: true,
      maskClosable: true,
      closeIcon: <div>X</div>,
    });
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 3 sec
    qc.invalidateQueries(["userProfile"]);
    // setMustSpin(false);
  };
  const token = useToken();
  const refBtn = useRef();
  const button = useCallback(
    () => (
      <img
        tabindex={isLoading ? -1 : 1}
        aria-hidden
        onClick={handleSpinClick}
        className={classNames(
          "button-play roulette-button",
          isLoading ? "pointer-none" : "",
          !isLoading && !mustSpin ? "change-opacity-spin" : ""
        )}
        src={mustSpin ? spin2 : spin1}
        alt=""
      />
    ),
    [handleSpinClick, isLoading, mustSpin]
  );

  // console.log(location);
  const { data: bill, isLoading: loadingBill } = useShowGiftClients(id, {
    refresh: true,
  });
  const { data: gifts } = useGetProduct({ isGiftExternal: true });
  if (!bill && loadingBill) {
    return <CustomSkeleton />;
  }
  if (!bill && !loadingBill) {
    return (
      <Result
        status={"404"}
        title="404 Bill Not Found!"
        extra={
          <Button onClick={() => nav("/c")} type="primary" key="console">
            Về trang chủ
          </Button>
        }
      />
    );
  }
  if (bill?.status === "DONE") {
    return (
      <Result
        status={"success"}
        title="Bạn đã quay được phần quà, vui lòng quay về trang chủ!"
        extra={
          <Button onClick={() => nav("/c")} type="primary" key="console">
            Về trang chủ
          </Button>
        }
      />
    );
  }

  if (bill?.status === "PENDING") {
    return (
      <Result
        status={"warning"}
        title="Bill đang chờ duyệt, vui lòng đợi!"
        // extra={
        //   <Button type="primary" key="console">
        //     Go Console
        //   </Button>
        // }
      />
    );
  }
  return (
    <div className="flex justify-center items-center">
      <div>
        <div className="text-red-500 text-2xl font-bold text-center mb-3">
          {user?.point <= 0 && !mustSpin && (
            <Button danger type="primary" size="large">
              {"Bạn đã hết lượt quay"}
            </Button>
          )}
        </div>
        <Card>
          <Suspense fallback={<div>Loading....</div>}>
            <CustomWheel
              gifts={gifts?.data}
              onEndWheel={onEndWheel}
              data={dataRandom?.name}
              mustSpin={mustSpin}
              button={button}
            />
          </Suspense>
        </Card>
      </div>
    </div>
  );
};

export default RollConsumer;
