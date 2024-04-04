import React from "react";
import { Link } from "react-router-dom";

const HomeConsumer = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div>
        <div>
          <div>Thông báo:----</div>
          <div>Số lần quay còn lại : 5</div>
          <div>Số lần đã quay : 5</div>
        </div>
        <div className="space-y-3 ">
          <Link to="/consumer/roll">Chụp hình hoá đơn và quay số</Link>
          <Link to="/consumer/history">Lịch sử quay số</Link>
          <Link to="/consumer/gift">Kho quà trúng thưởng</Link>
          <Link to="/consumer/bill">Lịch sử tham gia</Link>
        </div>
      </div>
    </div>
  );
};

export default HomeConsumer;
