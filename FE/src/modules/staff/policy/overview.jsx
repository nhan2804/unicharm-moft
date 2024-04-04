import useGetGPSLocation from "@hooks/useGetGPSLocation";

import { Card, Collapse, DatePicker, Empty, Form, Spin } from "antd";
import { ArrowRightOutlined, PlusOutlined } from "@ant-design/icons";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";

import useCreateCheckIn from "../hooks/mutate/useCreateCheckIn";

import useShowStore from "@modules/manager/stores/hooks/query/useShowStore";

import dayjs from "dayjs";
import { useAppDispatch, useAppSelector } from "@hooks/reduxHook";

import CustomPageHeader from "@components/CustomPageHeader";
import useOverviewPolicy from "../hooks/query/useOverviewPolicy";
import useGetStore from "@modules/manager/stores/hooks/query/useGetStore";
import useGetShift from "../hooks/query/useGetShift";
import { array2Object } from "@helper/array2Obj";
import useGetQuestionPolicy from "@modules/manager/questions/hooks/query/useGetQuestionPolicy";
import classNames from "classnames";

const OverviewPolicy = ({ initProject, month }) => {
  const { projectId, storeId } = useParams();

  const { data: place } = useShowStore(storeId);

  const { data: quesPolicy } = useGetQuestionPolicy();

  // const [month, setMonth] = useState(dayjs().startOf("month"));
  const search = {
    startTime: month?.valueOf(),
    endTime: month?.endOf("month")?.valueOf(),
    type: "POLICY",
  };
  console.log({ search });
  const { data: dataPolicies, isLoading: loadingFetch } =
    useOverviewPolicy(search);
  const { data: stores } = useGetStore();
  const { data: shifts } = useGetShift();
  const mapppingPolicy = useMemo(() => {
    return array2Object(quesPolicy, "_id", "name");
  }, [quesPolicy]);
  const policy = useMemo(() => {
    const mappingShift = array2Object(shifts, "_id", "name");
    const mappingStore = array2Object(stores?.data, "_id", "name");
    const data = dataPolicies?.map((e) => {
      return {
        ...e,
        shift: mappingShift?.[e?.shiftId],
        store: mappingStore?.[e?.storeId],
      };
    });
    const summary = {};
    data?.reduce((acc, cur) => {
      Object.entries(cur?.data || {}).reduce((acc2X, [k, v]) => {
        if (!summary[k]) {
          summary[k] = {
            point: 0,
            sum: 0,
          };
        }
        if (v?.checked) {
          summary[k].point += v?.point || 0;
          summary[k].sum += 1;
        }

        return acc2X;
      }, acc);
      return acc;
    }, {});
    return {
      summary: Object.entries(summary || {})?.map(([k, v]) => {
        return { name: mapppingPolicy?.[k], ...v };
      }),
      data,
    };
  }, [dataPolicies, mapppingPolicy, shifts, stores?.data]);
  // const policy = useMemo(() => {
  //   const mappingShift = array2Object(shifts, "_id", "name");
  //   const mappingStore = array2Object(stores?.data, "_id", "name");
  //   const data = dataPolicies?.map((e) => {
  //     return {
  //       ...e,
  //       shift: mappingShift?.[e?.shiftId],
  //       store: mappingStore?.[e?.storeId],
  //     };
  //   });
  //   const summary = {};
  //   const date = data?.reduce((acc, cur) => {
  //     const key = dayjs(cur?.createdAt).format("MM/YYYY");

  //     if (!acc[key]) {
  //       acc[key] = {};
  //     }

  //     if (!acc[key]["info"]) {
  //       acc[key]["info"] = {};
  //     }
  //     Object.entries(cur?.data || {}).reduce((acc2X, [k, v]) => {
  //       if (!acc2X[k]) {
  //         acc2X[k] = {};
  //       }
  //       if (!summary[k]) {
  //         summary[k] = {
  //           point: 0,
  //           sum: 0,
  //         };
  //       }
  //       if (v?.checked) {
  //         acc2X[k]["point"] = acc2X?.[k]?.["point"]
  //           ? acc2X[k]["point"] + (v?.point || 0)
  //           : v?.point || 0;
  //         acc2X[k]["sum"] = acc2X?.[k]?.["sum"] ? acc2X[k]["sum"] + 1 : 1;

  //         summary[k]["point"] += acc2X[k]["point"];
  //         summary[k]["sum"] += acc2X[k]["sum"];
  //       }
  //       return acc2X;
  //     }, acc[key]["info"]);
  //     if (!acc[key]["data"]) {
  //       acc[key]["data"] = [];
  //     }
  //     acc[key]["data"].push(cur);
  //     return acc;
  //   }, {});
  //   return {
  //     summary: Object.entries(summary || {})?.map(([k, v]) => {
  //       return { name: mapppingPolicy?.[k], ...v };
  //     }),
  //     date,
  //   };
  // }, [dataPolicies, mapppingPolicy, shifts, stores?.data]);
  const nav = useNavigate();
  console.log({ policy });
  // timeCheckIn

  const [form] = Form.useForm();
  const text = "xxx";
  const totalPoint = useMemo(() => {
    return (
      policy?.summary?.reduce((acc, curr) => {
        acc += curr?.point;
        return acc;
      }, 0) || 0
    );
  }, [policy]);
  if (dataPolicies?.length === 0 && !loadingFetch) {
    return <Empty></Empty>;
  }
  return (
    <div>
      {/* <CustomPageHeader title="Thống kê Policy" /> */}
      <Spin spinning={loadingFetch}>
        <div className="p-2">
          {/* <div className="flex justify-end">
            <DatePicker.MonthPicker
              onChange={setMonth}
              value={month}
            ></DatePicker.MonthPicker>
          </div> */}
          <Card>
            <div className="text-2xl font-bold">
              Tổng điểm :{" "}
              <span
                className={totalPoint >= 0 ? "text-green-500" : "text-red-500"}
              >
                {totalPoint}
              </span>
            </div>
            <ul className="m-0 p-0 list-none">
              {policy?.summary?.map((e) => {
                return (
                  <li
                    className={classNames(
                      // "font-semibold",
                      e?.point >= 0 ? "text-green-500" : "text-red-500"
                    )}
                    key={e?.name}
                  >
                    {e?.name}, Lần : {e?.sum} | Tổng điểm : {e?.point}
                  </li>
                );
              })}
            </ul>
          </Card>

          <div>
            {policy?.data?.map((item) => {
              return (
                <Card
                  // title={`Checkint At :
                  // ${dayjs(item?.timeCheckIn).format("DD/MM/YYYY HH:m:s")}`}
                  key={item?._id}
                  // className="text-center"
                  title={`${item?.store} - ${item?.shift} - ${dayjs(
                    item?.createdAt
                  ).format("DD/MM/YYYY HH:mm:ss")}`}
                >
                  {Object.entries(item?.data || {})?.map(([keyPoli, value]) => {
                    if (value?.checked) {
                      return (
                        <li
                          className={
                            value?.point >= 0
                              ? "text-green-500"
                              : "text-red-500"
                          }
                          key={keyPoli}
                        >
                          {mapppingPolicy?.[keyPoli]} : {value?.point}
                        </li>
                      );
                    }
                    return undefined;
                  })}
                </Card>
              );
            })}
          </div>
        </div>
      </Spin>
    </div>
  );
};

export default OverviewPolicy;
