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
import SingleImageUpload from "@components/SingleImageUpload";
import FormItem2 from "../question/FormItem2";
import useGetQuestionRating from "@modules/manager/questions/hooks/query/useGetQuestionStaff";

const OverviewRating = ({ initProject, month }) => {
  const { projectId, storeId } = useParams();
  const currentDepartmentIdRating = useAppSelector(
    (s) => s?.rating?.data?.departmentId
  );
  const { data: place } = useShowStore(storeId);

  const { data: quesRating } = useGetQuestionRating();

  //   const [month, setMonth] = useState(dayjs().startOf("month"));
  const search = {
    startTime: month?.valueOf(),
    endTime: month?.endOf("month")?.valueOf(),
    type: "RATING",
  };
  console.log({ search });
  const { data: dataPolicies, isLoading: loadingFetch } =
    useOverviewPolicy(search);
  const { data: stores } = useGetStore();
  const { data: shifts } = useGetShift();
  const mapppingPolicy = useMemo(() => {
    return array2Object(quesRating, "_id", "name");
  }, [quesRating]);
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
    return data;
  }, [dataPolicies, shifts, stores]);

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
  if (dataPolicies?.length === 0 && !loadingFetch) {
    return <Empty></Empty>;
  }

  return (
    <div>
      <Spin spinning={loadingFetch}>
        <div className="p-2">
          {/* <div className="flex justify-end">
            <DatePicker.MonthPicker
              onChange={setMonth}
              value={month}
            ></DatePicker.MonthPicker>
          </div> */}

          <div>
            {policy?.map((item) => {
              return (
                <Card
                  // title={`Checkint At :
                  // ${dayjs(item?.timeCheckIn).format("DD/MM/YYYY HH:m:s")}`}
                  key={item?._id}
                  // className="text-center"
                  title={`${dayjs(item?.createdAt).format(
                    "DD/MM/YYYY HH:mm:ss"
                  )} - ${item?.store} - ${item?.shift} - ${
                    item?.totalPoint
                  } điểm`}
                >
                  <Form
                    disabled
                    //   disabled={isLoading || !!currentQues}

                    name="basic"
                    initialValues={item}
                    // onFinish={onFinish}

                    // onFinish={initData ? onUpdate : onFinish}
                    autoComplete="off"
                    layout="vertical"
                  >
                    <div className="radio-group-block">
                      {quesRating?.map((e) => {
                        const option = e?.option?.filter((e) => {
                          // if (!e?.exceptDepartmentIds) return true;
                          return !e?.exceptDepartmentIds?.includes(
                            currentDepartmentIdRating
                          );
                        });
                        return (
                          <Card className="mb-2" key={e?._id}>
                            <FormItem2
                              nestedName={["data"]}
                              question={{ ...e, option }}
                            />
                          </Card>
                        );
                      })}
                      <Card>
                        <SingleImageUpload
                          preview={true}
                          // capture="user"
                          rules={[
                            { required: true, message: "Vui lòng upload ảnh" },
                          ]}
                          label="Hình ảnh"
                          name="image"
                        />
                      </Card>
                    </div>
                  </Form>
                </Card>
              );
            })}
          </div>
        </div>
      </Spin>
    </div>
  );
};

export default OverviewRating;
