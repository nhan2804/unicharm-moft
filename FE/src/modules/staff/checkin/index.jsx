import SingleImageUpload from "@components/SingleImageUpload";
import useGetGPSLocation from "@hooks/useGetGPSLocation";

import {
  Avatar,
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  List,
  Select,
  Switch,
  Table,
} from "antd";
import { ArrowRightOutlined, PlusOutlined } from "@ant-design/icons";
import React, { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import useCreateCheckIn from "../hooks/mutate/useCreateCheckIn";
import useShowCheckIn from "../hooks/query/useShowCheckIn";
import useShowStore from "@modules/manager/stores/hooks/query/useShowStore";
import useGetCheckIn from "../hooks/query/useGetCheckInToday";
import dayjs from "dayjs";
import { useAppDispatch, useAppSelector } from "@hooks/reduxHook";
import { setCurrentCheckIn } from "../slices/staff";
import useGetShift from "../hooks/query/useGetShift";
import CustomPageHeader from "@components/CustomPageHeader";

const CheckinPage = ({ initProject }) => {
  const { projectId, storeId } = useParams();

  const { isError, isLoading: loadingLocation, location } = useGetGPSLocation();

  const { data: place } = useShowStore(storeId);

  const { data: checkIns, isLoading: loadingFetch } = useGetCheckIn(storeId);
  const { mutate: createCheckin, isLoading: loadingCreate } =
    useCreateCheckIn(storeId);
  const nav = useNavigate();
  useEffect(() => {
    if (checkIns?.length === 0 && !loadingFetch) {
      nav(`create`);
    }
  }, [checkIns, nav, place, projectId, storeId, loadingFetch]);

  // timeCheckIn

  const [form] = Form.useForm();

  const onFinish = (values) => {
    createCheckin({
      ...values,
      location: `${location.latitude},${location.longitude}`,
    });
  };
  const onCreateBtn = () => {
    form.submit();
  };
  const onUpdate = (values) => {
    console.log({ values });
    // updateSubmit({ _id: dataSubmited?._id, formData: values });
  };
  const { data: shifts } = useGetShift();
  const dispatch = useAppDispatch();
  if (loadingLocation) {
    return (
      <p className="text-2xl text-center text-yellow-400">
        Đang lấy thông tin GPS ...
      </p>
    );
  }
  if (isError) {
    return (
      <p className="text-2xl text-center text-red-400">
        Không thể lấy thông tin GPS của bạn, vui lòng chắc chắn rằng bạn đã cho
        phép quyền sử dụng định vị, thử lại sau ...
      </p>
    );
  }

  const onClickHanle = (checkIn) => {
    console.log({ checkIn });
    dispatch(setCurrentCheckIn(checkIn?._id));
    nav(`/staff/stores/${checkIn?.storeId || checkIn?.placeId}`);
  };

  return (
    <div>
      <CustomPageHeader title="Danh sách checkin" />
      <div className="p-2">
        <p className="text-center mb-10">
          Bạn đang checkin tại địa điểm :{" "}
          <span className="font-semibold">{place?.name}</span>, đổi địa điểm tại{" "}
          <Link className="font-semibold" to={`/staff/store`}>
            ĐÂY
          </Link>
        </p>
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
                      Checkint At [{item?.shift?.name}] :<br />
                      {dayjs(item?.timeCheckIn).format("HH:mm:ss")}{" "}
                      {item?.timeCheckOut
                        ? ` - ${dayjs(item?.timeCheckOut).format("HH:mm:ss")}`
                        : ""}
                    </div>
                    {!item?.timeCheckOut && (
                      <div>
                        <Button
                          icon={<ArrowRightOutlined />}
                          danger
                          type="dashed"
                          onClick={() => {
                            onClickHanle(item);
                          }}
                        >
                          Vào ca này
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}

          <div className="text-center">
            <Link className="mt-6 block" to={"create"}>
              <Button icon={<PlusOutlined />} type="primary">
                Thêm CheckIn{" "}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckinPage;
