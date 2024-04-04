import { Button, Card, Form, Input, Modal, theme } from "antd";
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
  const { mutate: random, isLoading, data: dataRandom } = useRandomGift();
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
    if (point > 0 && !isLoading) {
      console.log("start spin");
      onFinish();
    }
  }, [onFinish, point, isLoading]);

  const onEndWheel = async () => {
    // qc.cancelQueries(["userProfile"]);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 3 sec
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
              onEndWheel={onEndWheel}
              data={dataRandom?.final}
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
