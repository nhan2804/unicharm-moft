import { Avatar, Card, Input, List, Select } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";

import dayjs from "dayjs";
import useGetStore from "@modules/manager/stores/hooks/query/useGetStore";
import useGetShift from "@modules/staff/hooks/query/useGetShift";
import useGetCheckInForRating from "@modules/staff/hooks/query/useGetCheckInForRating";
import CustomPageHeader from "@components/CustomPageHeader";
import { array2Object } from "@helper/array2Obj";
import useShowStore from "@modules/manager/stores/hooks/query/useShowStore";
import { useAppSelector } from "@hooks/reduxHook";
const { Option } = Select;
const SelectStorePage = () => {
  const identifier = useAppSelector((s) => s?.rating?.data);
  const { storeId } = useParams();
  const [shiftSelected, setShiftSelected] = useState();
  const nav = useNavigate();
  const { data: shift } = useGetShift();
  const [search, setSearch] = useState("");
  const { data: checkin } = useGetCheckInForRating(storeId, {
    shiftId: shiftSelected,
  });
  const mappingShift = array2Object(shift, "_id");
  const shiftOptions = useMemo(() => {
    return shift?.map((e) => ({ label: e?.name, value: e?._id }));
  }, [shift]);
  console.log(checkin);
  const { data: store } = useShowStore(storeId);
  // useEffect(() => {
  //   if (stores?.length === 1) {
  //     nav(`/project-submit/${projectId}/submit/${stores?.[0]?._id}`);
  //   }
  // }, [stores, nav, projectId]);

  return (
    <div>
      <CustomPageHeader title={`Cửa hàng: ` + store?.name} />
      <div className="p-4">
        <div className="flex justify-center items-center">
          <div>
            <h1 className="text-center">
              Vui lòng chọn một nhân viên để tiếp tục
            </h1>
            <div className="mb-2 flex ">
              {/* <Input
                placeholder="Tìm kiếm"
                value={search}
                onChange={(e) => setSearch(e?.target?.value)}
              /> */}
              <Select
                placeholder="Chọn ca"
                onChange={setShiftSelected}
                className="w-[150px]"
                options={shiftOptions || []}
                allowClear
              />
            </div>

            <div className="">
              {/* <Select onChange={onChange} style={{ width: 200 }}>
              {stores?.map((e, index) => (
                <Option value={e?._id}>{e?.name}</Option>
              ))}
            </Select> */}
              <div className="">
                <Card>
                  <List
                    itemLayout="vertical"
                    dataSource={checkin}
                    renderItem={(item, index) => (
                      <Link
                        to={`/rating/stores/${storeId}/users/${
                          item?.owner?._id
                        }/checkin/${item?._id}${
                          identifier?.type === "POLICY" ? "/policy" : ""
                        }/?shiftId=${item?.shiftId}`}
                      >
                        <List.Item>
                          <List.Item.Meta
                            avatar={
                              <Avatar
                                src={item?.owner?.avatar}
                                style={{
                                  backgroundColor: "#f56a00",
                                }}
                              >
                                {item?.owner?.fullName?.charAt(0)}
                              </Avatar>
                            }
                            title={
                              // <Link
                              //   to={`/rating/stores/${storeId}/users/${
                              //     item?.owner?._id
                              //   }/checkin/${item?._id}${
                              //     identifier.type === "POLICY" ? "/policy" : ""
                              //   }/?shiftId=${item?.shiftId}`}
                              // >
                              item?.owner?.fullName
                              // </Link>
                            }
                            description={
                              <div>
                                <p>{item?.owner?.username}</p>
                                Checkin vào [
                                {mappingShift?.[item?.shiftId]?.name}
                                ] :<br />
                                {dayjs(item?.timeCheckIn).format(
                                  "HH:mm:ss"
                                )}{" "}
                                {item?.timeCheckOut
                                  ? ` - ${dayjs(item?.timeCheckOut).format(
                                      "HH:mm:ss"
                                    )}`
                                  : ""}
                              </div>
                            }
                          />
                        </List.Item>
                      </Link>
                    )}
                  />
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectStorePage;
