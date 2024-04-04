import React from "react";
import WheelComponent from "../Wheel";

const Roll = () => {
  const segments = ["Happy", "Angry", "Sad", "Frustration", "Emptyness"];
  const segColors = [
    "#EE4040",
    "#F0CF50",
    "#815CD1",
    "#3DA5E0",
    // "#34A24F",
    // "#F9AA1F",
    // "#EC3F3F",
    "#FF9000",
  ];
  const onFinished = (winner) => {
    console.log(winner);
  };
  return (
    <div>
      <div id="wheelCircle">
        <WheelComponent
          segments={segments}
          segColors={segColors}
          winningSegment=""
          onFinished={(winner) => onFinished(winner)}
          primaryColor="black"
          primaryColoraround="#ffffffb4"
          contrastColor="white"
          buttonText="Spin"
          isOnlyOnce={false}
          size={190}
          upDuration={50}
          downDuration={2000}
        />
      </div>
    </div>
  );
};

export default Roll;
