import { Button, Card, Form, Result, Modal, theme, Image } from "antd";
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
import useShowProduct from "@modules/manager/products/hooks/query/useShowProduct";
import img1 from "@assets/gift/1.png";
import img2 from "@assets/gift/2.png";
import img3 from "@assets/gift/3.png";
import img4 from "@assets/gift/4.png";
import { toast } from "react-toastify";
export const _getImg = (name) => {
  let _n = name?.toLowerCase() || "";
  if (_n.includes("khẩu trang")) {
    return img4;
  }
  if (_n.includes("khăn giấy")) {
    return img3;
  }
  if (_n.includes("bàn cào")) {
    return img1;
  }
  if (_n.includes("cần câu")) {
    return img2;
  }
};
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
      { delay, noMess: true },
      {
        onSuccess: (data) => {
          console.log("xx");
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

  const onEndWheel = useCallback(async () => {
    // qc.cancelQueries(["userProfile"]);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 3 sec
    // alert(`OTP của bạn là ` + dataRandom?.code);
    return;

    // setMustSpin(false);
  }, []);

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
  const imgGift = Object.entries(bill?.products || {})?.[0]?.[0];
  const { data: gift } = useShowProduct(imgGift);
  const { data: gifts } = useGetProduct({ isGiftExternal: true });
  if (!bill && loadingBill) {
    return <CustomSkeleton />;
  }
  const closeX = () => {
    window.close();
  };
  if (!bill && !loadingBill) {
    return (
      <Result
        status={"404"}
        title="404 Bill Not Found!"
        extra={
          <Button onClick={closeX} type="primary" key="console">
            Đóng
          </Button>
        }
      />
    );
  }
  if (true) {
    if (bill?.status === "DONE") {
      return (
        <Result
          status={"success"}
          title="Bạn đã quay được phần quà, vui lòng quay về trang chủ!"
          extra={
            <Button onClick={closeX} type="primary" key="console">
              Về trang chủ
            </Button>
          }
        />
      );
    }
    if (bill?.status === "DENY") {
      return (
        <Result
          status={"error"}
          title="Bill của bạn đã bị từ chối "
          children={<div>{bill?.reasonBill}</div>}
        />
      );
    }
    if (bill?.status === "CONFIRM") {
      return (
        <Result
          status={"success"}
          title="Bạn đã quay trúng phần quà"
          children={
            <div className="flex justify-center">
              <div>
                <Image src={_getImg(gift?.name)} />
                <div className="text-center font-semibold text-2xl">
                  {gift?.name}
                </div>
                <div className="text-primary text-center font-semibold">
                  Vui lòng đưa OTP đã được gửi qua số điện thoại và kết quả phần
                  quà cho nhân viên để xác nhận
                </div>
              </div>
            </div>
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
  }
  return (
    <div className="flex justify-center items-center">
      <div>
        <div className="text-2xl text-center text-primary font-semibold">
          Quay quà
        </div>
        <div>
          {[img1, img2, img3, img4].map((e) => {
            return <img className="w-0 h-0" src={e} alt="" key={e} />;
          })}
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
