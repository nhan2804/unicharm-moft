import { Card, Empty, Spin } from "antd";
import React from "react";

import dayjs from "dayjs";
import useOverviewCheckin from "../hooks/query/useOverviewCheckin";

const OverviewCheckin = ({ month }) => {
  const search = {
    startTime: month?.valueOf(),
    endTime: month?.endOf("month")?.valueOf(),
  };
  const { data: checkIns, isLoading: loadingFetch } =
    useOverviewCheckin(search);
  // timeCheckIn
  if (checkIns?.length === 0 && !loadingFetch) {
    return <Empty></Empty>;
  }
  return (
    <div>
      <Spin spinning={loadingFetch}>
        {" "}
        <div className="p-2">
          <div>
            {checkIns?.map((item) => {
              return (
                <Card
                  // title={`Checkint At :
                  // ${dayjs(item?.timeCheckIn).format("DD/MM/YYYY HH:m:s")}`}
                  key={item?._id}
                  // className="text-center"
                >
                  {item?.timeCheckIn && (
                    <div className="flex justify-between space-x-1">
                      <div>
                        {" "}
                        Checkint At [{item?.shift?.name}]:
                        {dayjs(item?.timeCheckIn).format(
                          "DD/MM/YYYY HH:mm:ss"
                        )}{" "}
                        {item?.timeCheckOut
                          ? ` - ${dayjs(item?.timeCheckOut).format("HH:mm:ss")}`
                          : ""}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </Spin>
    </div>
  );
};

export default OverviewCheckin;
