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
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React, { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import useCreateCheckIn from "../hooks/mutate/useCreateCheckIn";
import useShowCheckIn from "../hooks/query/useShowCheckIn";
import useShowStore from "@modules/manager/stores/hooks/query/useShowStore";
import useGetShift from "../hooks/query/useGetShift";
import { useAppDispatch } from "@hooks/reduxHook";
import { setCurrentCheckIn } from "../slices/staff";
import CustomPageHeader from "@components/CustomPageHeader";
import dayjs from "dayjs";
const CreateCheckinPage = ({ initProject }) => {
  const { storeId } = useParams();

  const {
    isError,
    isLoading: loadingLocation,
    location,
    location2String,
  } = useGetGPSLocation();

  const { data: place } = useShowStore(storeId);

  const { mutate: createCheckin, isLoading: loadingCreate } =
    useCreateCheckIn(storeId);

  // timeCheckIn

  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const nav = useNavigate();
  const onFinish = (values) => {
    createCheckin(
      {
        ...values,
        location: `${location.latitude},${location.longitude}`,
      },
      {
        onSuccess: (checkIn) => {
          dispatch(setCurrentCheckIn(checkIn?._id));
          nav(`/staff/stores/${checkIn?.storeId || checkIn?.placeId}`);
        },
      }
    );
  };

  const { data: shifts } = useGetShift();
  const text2Draw = useMemo(() => {
    return [dayjs().format("DD/MM/YYYY HH:mm:ss"), location2String];
  }, [location2String]);
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

  return (
    <div>
      <CustomPageHeader title="Tạo mới checkin" />
      <div className="p-2">
        <>
          <p className="text-center mb-10">
            Bạn đang checkin tại địa điểm :{" "}
            <span className="font-semibold">{place?.name}</span>, đổi địa điểm
            tại{" "}
            <Link className="font-semibold" to={`/staff/store`}>
              ĐÂY
            </Link>
          </p>
          <div className="flex justify-center w-full">
            <Form
              name="basic"
              onFinish={onFinish}
              autoComplete="off"
              layout="vertical"
              form={form}
            >
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn ca",
                  },
                ]}
                name={"shiftId"}
              >
                <Select placeholder="Chọn ca" style={{ width: "100%" }}>
                  {shifts?.map((e) => {
                    return (
                      <Select.Option key={e?._id}>{e?.name}</Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <SingleImageUpload
                textDraw={text2Draw}
                capture="user"
                rules={[{ required: true, message: "Vui lòng tải lên ảnh" }]}
                label="Ảnh checkin"
                name="imageCheckin"
              />
              <div className="text-center">
                <Button
                  type="primary"
                  loading={loadingCreate}
                  htmlType="submit"
                >
                  Checkin
                </Button>
              </div>
            </Form>
          </div>
        </>
      </div>
    </div>
  );
};

export default CreateCheckinPage;
