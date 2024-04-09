import React, { useState } from "react";
import { Wheel } from "react-custom-roulette";
// import uuid from "react-uuid";
import "./index.css";
import { useMemo } from "react";

const arrBg = {
  0: {
    textColor: "#F08100",
    backgroundColor: "#ffffff",
  },
  1: {
    textColor: "#ffffff",
    backgroundColor: "#F08100",
  },
};
const CustomWheel = ({ data, onEndWheel, button, mustSpin, gifts }) => {
  const _data = useMemo(() => {
    return gifts
      ?.map((e, i) => {
        return {
          image: e?.image,
          text: e?.name,
          id: e?._id,
          final: e?.name,
          style: {
            ...arrBg[i % 2],
            fontSize: 28,
            fontWeight: 800,
          },
        };
      })
      .map((item) => {
        //         cƯ
        const img1 = new Image(); // Image constructor
        img1.src = item?.image;
        img1.alt = "alt";
        return {
          ...item,
          completeOption: item.text,
          option:
            item.text.length >= 30
              ? item.text.substring(0, 30).trimEnd() + "..."
              : item.text,
          image: {
            uri: item?.image,
          },
        };
      });
  }, [gifts]);
  const prizeNumber = _data?.findIndex((e) => e?.name === data);

  const wheel = useMemo(
    () => (
      <>
        <Wheel
          pointerProps={{
            style: {
              top: 0,
              display: "none",
              // left: 10,
            },
          }}
          mustStartSpinning={mustSpin}
          spinDuration={[0.2]}
          prizeNumber={prizeNumber}
          data={_data}
          perpendicularText={true}
          outerBorderColor={["#F08100"]}
          outerBorderWidth={[12]}
          innerBorderColor={["#f2f2f2"]}
          radiusLineColor={["tranparent"]}
          radiusLineWidth={[1]}
          // textColors={["#f5f5f5"]}
          textDistance={55}
          disableInitialAnimation={true}
          onStopSpinning={() => {
            onEndWheel?.();
          }}
        />
      </>
    ),
    [_data, mustSpin, onEndWheel, prizeNumber]
  );

  return (
    <>
      <div align="center" className="roulette-container overflow-hidden">
        {wheel}
        {button?.({})}
      </div>
    </>
  );
};

export default React.memo(CustomWheel);
