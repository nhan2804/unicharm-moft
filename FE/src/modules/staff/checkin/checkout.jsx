import SingleImageUpload from "@components/SingleImageUpload";
import useGetGPSLocation from "@hooks/useGetGPSLocation";

import {
  Alert,
  Button,
  Checkbox,
  Form,
  Input,
  Spin,
  Switch,
  Table,
  message,
} from "antd";
import React, { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import { LogoutOutlined } from "@ant-design/icons";
import useShowStore from "@modules/manager/stores/hooks/query/useShowStore";
import useShowCheckIn from "../hooks/query/useShowCheckIn";
import useUpdateCheckIn from "../hooks/mutate/useUpdateCheckin";
import useGetReport from "../hooks/query/useGetReport";
import { useAppDispatch, useAppSelector } from "@hooks/reduxHook";
import useGetImage from "@modules/manager/images/hooks/query/useGetImage";
import { setCurrentCheckIn } from "../slices/staff";
import CustomPageHeader from "@components/CustomPageHeader";
import useGetNotificationByCheckinId from "../hooks/query/useGetNotificationByCheckinId";
import dayjs from "dayjs";
import useRole from "@hooks/useRole";
const hasAttributes = (obj, attrs) => {
  return attrs.every((e) => obj?.hasOwnProperty(e));
};
const CheckoutPage = ({ initProject }) => {
  const { storeId, checkinId } = useParams();

  const {
    isError,
    isLoading: loadingLocation,
    location,
    location2String,
  } = useGetGPSLocation();
  const text2Draw = useMemo(() => {
    return [dayjs().format("DD/MM/YYYY HH:mm:ss"), location2String];
  }, [location2String]);
  const { data: place } = useShowStore(storeId);
  const { data: checkIn, isLoading } = useShowCheckIn(storeId, checkinId);

  const nav = useNavigate();
  //   useEffect(() => {
  //     if (!checkIn) {
  //       alert("Bạn chưa checkin");
  //       window.location.href = "/";
  //     }
  //   }, [checkIn, nav, placeId, projectId]);

  // timeCheckIn
  const currentCheckIn = useAppSelector((s) => s?.staff?.currentCheckIn);
  const [form] = Form.useForm();
  const { data: images, isLoading: loadingImages } = useGetImage();
  const { data: currentReport, isLoading: loadingCurrent } = useGetReport(
    storeId,
    "image",
    {
      checkinId: currentCheckIn,
    }
  );

  const { data: currentNotification, isLoading: loadingNoti } =
    useGetNotificationByCheckinId(currentCheckIn);
  // const { data: currentReportGift, isLoading: loadingCurrentGift } =
  //   useGetReport(storeId, "gift", {
  //     checkinId: currentCheckIn,
  //   });
  const { data: currentReportOos, isLoading: loadingCurrentOos } = useGetReport(
    storeId,
    "oos",
    {
      checkinId: currentCheckIn,
    }
  );
  // const { data: currentReportSampling, isLoading: loadingCurrentSampling } =
  //   useGetReport(storeId, "sampling", {
  //     checkinId: currentCheckIn,
  //   });
  const { data: currentReportSale, isLoading: loadingCurrentSale } =
    useGetReport(storeId, "sale", {
      checkinId: currentCheckIn,
    });
  const loadingAll =
    loadingCurrent ||
    // loadingCurrentGift ||
    loadingCurrentOos ||
    loadingNoti ||
    // loadingCurrentSampling ||
    loadingCurrentSale;
  const validCheckIn = useMemo(() => {
    const valid = images?.every((e) => {
      return currentReport?.dataImage?.[e?._id];
    });

    return valid;
  }, [currentReport, images]);

  // const validReportOos = useMemo(() => {
  //   return hasAttributes(currentReportOos, [
  //     "endShiftInventoryOOS",
  //     "startShiftInventoryOOS",
  //     "midShiftAddProductOOS",
  //   ]);
  // }, [currentReportOos]);

  // const validReportGift = useMemo(() => {
  //   return hasAttributes(currentReportGift, [
  //     "startShiftInventory",
  //     "midShiftAddProduct",
  //     "endShiftInventory",
  //     "usingGift",
  //   ]);
  // }, [currentReportGift]);
  // const validReportSampling = useMemo(() => {
  //   return hasAttributes(currentReportSampling, [
  //     "endShiftInventorySampling",
  //     "midShiftAddProductSampling",
  //     "startShiftInventorySampling",
  //     "usingSampling",
  //   ]);
  // }, [currentReportSampling]);
  const __ = useRole();

  const allReportSubmited =
    (!!currentReport &&
      // !!validReportGift &&
      !!currentReportOos &&
      !!validCheckIn &&
      !currentNotification &&
      // !!validReportSampling &&
      !!currentReportSale) ||
    __.isSup;
  console.log({
    x: !!currentReport,
  });
  const { mutate: checkOutFn, isLoading: loadingCheckout } =
    useUpdateCheckIn(storeId);
  const dispatch = useAppDispatch();
  // useEffect(() => {
  //   if (checkIn?.timeCheckOut) {
  //     dispatch(setCurrentCheckIn(checkIn?._id));
  //     nav(`/staff`);
  //   }
  // }, [checkIn, dispatch, nav]);

  const onFinish = (values) => {
    checkOutFn(
      {
        ...values,
        locationCheckOut: `${location.latitude},${location.longitude}`,
        updateTimeCheckOut: true,
        _id: checkIn?._id,
      },
      {
        onSuccess: () => {
          dispatch(setCurrentCheckIn(undefined));
          nav(`/staff`);
        },
      }
    );
  };

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
      <CustomPageHeader title="Checkout"></CustomPageHeader>
      <div className="p-2">
        {checkIn && !isLoading && (
          <>
            <p className="text-center mb-10">
              Bạn đang checkout tại địa điểm :{" "}
              <span className="font-semibold">{place?.name}</span>, đổi địa điểm
              tại{" "}
              <Link className="font-semibold" to={`/staff/store`}>
                ĐÂY
              </Link>
            </p>

            <div className="flex justify-center">
              <Spin spinning={loadingAll}>
                {allReportSubmited ? (
                  <Form
                    name="basic"
                    onFinish={onFinish}
                    autoComplete="off"
                    layout="vertical"
                    form={form}
                  >
                    <SingleImageUpload
                      textDraw={text2Draw}
                      capture="user"
                      rules={[
                        { required: true, message: "Vui lòng upload ảnh" },
                      ]}
                      label="Ảnh checkout"
                      name="imageCheckOut"
                    />
                    <Button
                      disabled={loadingCurrent || loadingImages}
                      danger
                      icon={<LogoutOutlined />}
                      type="primary"
                      loading={loadingCheckout}
                      htmlType="submit"
                    >
                      Checkout
                    </Button>
                  </Form>
                ) : (
                  <div>
                    {(!validCheckIn || !currentReport) && (
                      <div>
                        <Alert
                          message={
                            <>
                              Bạn cần phải hoàn tất tải lên hình ảnh ca này
                              trước khi checkout, tải lên{" "}
                              <Link
                                className="font-bold"
                                to={`/staff/stores/${storeId}/image`}
                              >
                                TẠI ĐÂY
                              </Link>
                              !
                            </>
                          }
                          showIcon
                          type="warning"
                        ></Alert>
                      </div>
                    )}
                    {!currentReportSale && (
                      <div>
                        <Alert
                          message={
                            <>
                              Bạn chưa hoàn tất báo cáo số bán, báo cáo{" "}
                              <Link
                                className="font-bold"
                                to={`/staff/stores/${storeId}/sale`}
                              >
                                TẠI ĐÂY
                              </Link>
                              !
                            </>
                          }
                          showIcon
                          type="warning"
                        ></Alert>
                      </div>
                    )}
                    {!currentReportOos && (
                      <div>
                        <Alert
                          message={
                            <>
                              Bạn chưa hoàn tất báo cáo oos, báo cáo{" "}
                              <Link
                                className="font-bold"
                                to={`/staff/stores/${storeId}/oos`}
                              >
                                TẠI ĐÂY
                              </Link>
                              !
                            </>
                          }
                          showIcon
                          type="warning"
                        ></Alert>
                      </div>
                    )}
                    {/* {!validReportGift && (
                      <div>
                        <Alert
                          message={
                            <>
                              Bạn chưa hoàn tất báo cáo quà tặng, báo cáo{" "}
                              <Link
                                className="font-bold"
                                to={`/staff/stores/${storeId}/gift`}
                              >
                                TẠI ĐÂY
                              </Link>
                              !
                            </>
                          }
                          showIcon
                          type="warning"
                        ></Alert>
                      </div>
                    )} */}
                    {!!currentNotification && (
                      <div>
                        <Alert
                          message={
                            <>
                              Bạn chưa tắt báo cáo khẩn, tắt tại{" "}
                              <Link
                                className="font-bold"
                                to={`/staff/stores/${storeId}/notification`}
                              >
                                TẠI ĐÂY
                              </Link>
                              !
                            </>
                          }
                          showIcon
                          type="warning"
                        ></Alert>
                      </div>
                    )}
                    {/* {!validReportSampling && (
                      <div>
                        <Alert
                          message={
                            <>
                              Bạn chưa hoàn tất báo cáo sampling, báo cáo{" "}
                              <Link
                                className="font-bold"
                                to={`/staff/stores/${storeId}/sampling`}
                              >
                                TẠI ĐÂY
                              </Link>
                              !
                            </>
                          }
                          showIcon
                          type="warning"
                        ></Alert>
                      </div>
                    )} */}
                    {/* <Alert
                      type="error"
                      showIcon
                      message="Bạn không thể checkout khi chưa hoàn tất tất cả báo cáo (số bán, quà tặng, oos, sampling, hình ảnh)"
                    ></Alert> */}
                  </div>
                )}
              </Spin>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
