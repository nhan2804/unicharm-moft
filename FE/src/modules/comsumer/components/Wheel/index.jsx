import React, { useState } from "react";
import { Wheel } from "react-custom-roulette";
// import uuid from "react-uuid";
import "./index.css";
import { useMemo } from "react";
const _data = [
  {
    final: "10",
    id: 1,
    text: "10.000đ",
    style: {
      textColor: "#028342",
      backgroundColor: "#ffffff",
      fontSize: 28,
      fontWeight: 800,
    },
  },
  {
    final: "20",
    id: 2,
    text: "20.000đ",
    style: {
      textColor: "#ffffff",
      backgroundColor: "#028342",
      fontSize: 28,
      fontWeight: 800,
    },
  },
  {
    final: "50",
    id: 3,
    text: "50.000đ",
    style: {
      textColor: "#028342",
      backgroundColor: "#ffffff",
      fontSize: 28,
      fontWeight: 800,
    },
  },
  {
    final: "goodluck",
    id: 4,
    text: "May mắn lần sau",
    style: {
      textColor: "#ffffff",
      backgroundColor: "#028342",
    },
  },
  {
    final: "10",
    id: 5,
    text: "10.000đ",
    style: {
      textColor: "#028342",
      backgroundColor: "#ffffff",
      fontSize: 28,
      fontWeight: 800,
    },
  },
  {
    final: "20",
    id: 6,
    text: "20.000đ",
    style: {
      textColor: "#ffffff",
      backgroundColor: "#028342",
      fontSize: 28,
      fontWeight: 800,
    },
  },
  {
    final: "50",
    id: 7,
    text: "50.000đ",
    style: {
      textColor: "#028342",
      backgroundColor: "#ffffff",
      fontSize: 28,
      fontWeight: 800,
    },
  },
  {
    final: "goodluck",
    id: 8,
    text: "May mắn lần sau",
    style: {
      textColor: "#ffffff",
      backgroundColor: "#028342",
    },
  },
].map((item) => {
  return {
    ...item,
    completeOption: item.text,
    option:
      item.text.length >= 30
        ? item.text.substring(0, 30).trimEnd() + "..."
        : item.text,
  };
});

const CustomWheel = ({ data, onEndWheel, button, mustSpin }) => {
  const prizeNumber = _data?.findIndex((e) => e?.final === data);

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
          outerBorderColor={["#186732"]}
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
    [mustSpin, onEndWheel, prizeNumber]
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
