import CustomPageHeader from "@components/CustomPageHeader";
import useGetQuestionRating from "@modules/manager/questions/hooks/query/useGetQuestionStaff";
import useShowUser from "@modules/manager/users/hooks/query/useShowUser";
import FormItem2 from "@modules/staff/question/FormItem2";
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Divider,
  Form,
  Image,
  Input,
  Spin,
  notification,
} from "antd";
import React, { useEffect } from "react";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router";
import SingleImageUpload from "@components/SingleImageUpload";
import useCreateNewRating from "../hooks/mutate/useCreateNewRating";
import useGetRatingToday from "../hooks/query/useGetRatingToday";
import useQueryString2 from "@hooks/useQueryString2";
import { useAppSelector } from "@hooks/reduxHook";
import { array2Object } from "@helper/array2Obj";
import { toast } from "react-toastify";
import useShowDepartment from "@modules/manager/departments/hooks/query/useShowDepartment";
import { Link } from "react-router-dom";
import useGetQuestionPolicy from "@modules/manager/questions/hooks/query/useGetQuestionPolicy";

const PolicyUserPage = () => {
  const identifier = useAppSelector((s) => s?.rating?.data);

  const currentDepartmentIdRating = useAppSelector(
    (s) => s?.rating?.data?.departmentId
  );

  const { data: department } = useShowDepartment(currentDepartmentIdRating);
  const isIdentify = !!identifier?.phoneMarker;

  const nav = useNavigate();
  useEffect(() => {
    if (!isIdentify) nav("/rating/identify");
  }, [nav, isIdentify]);
  useEffect(() => {
    if (identifier?.type !== "POLICY") nav("/rating/identify");
  }, [nav, identifier]);

  const { storeId, checkinId, userId } = useParams();
  const { qsParsed } = useQueryString2();
  const shiftId = qsParsed?.shiftId;
  const [form] = Form.useForm();
  const { data: questions } = useGetQuestionPolicy();
  const { mutate: createRating } = useCreateNewRating();

  const { data: currentRating, isLoading } = useGetRatingToday({
    shiftId,
    storeId,
    checkinId,
    userId,
    type: "POLICY",
  });
  useEffect(() => {
    if (!!currentRating) {
      form.setFieldsValue(currentRating);
    }
  }, [currentRating, form, questions]);

  const { data: user } = useShowUser(userId);

  //   const user = dataUser?.payload;
  const getPoint = (v) => {
    const mappingQuestion = array2Object(questions, "_id");
    const totalAns = questions?.filter((e) => !!e?.option)?.length;

    const total = Object.entries(v || {}).reduce((all, q) => {
      const question = mappingQuestion?.[q?.[0]];
      const option = array2Object(question?.option, "value");
      const point = option?.[q?.[1]]?.point || 0;

      all += point;
      return all;
    }, 0);
    if (!totalAns) return 0;
    return (total / totalAns).toFixed(1);
  };
  const onFinish = (value) => {
    console.log({ value });
    const point =
      Object.entries(value?.data || {})?.reduce((acc, [key, curr]) => {
        if (curr?.checked) {
          acc += curr?.point || 0;
        }
        return acc;
      }, 0) || 0;
    const rs = window.confirm(
      `Điểm số hiện tại là : ${point} .Bạn có chắc muốn đánh giá với số điểm này?`
    );
    if (!rs) return;
    createRating(
      {
        ...value,
        shiftId,
        storeId,
        checkinId,
        userId,
        _id: currentRating?._id,
        ...identifier,
        totalPoint: point,
      },
      {
        onSuccess: () => {
          notification.success({
            placement: "bottomRight",
            duration: 5,
            message: "Cảm ơn Anh/Chị đã đánh giá nhân sự",
          });
          nav(-1);
        },
      }
    );
  };

  return (
    <div>
      <CustomPageHeader title="Policy nhân viên" />
      <Alert
        showIcon
        description={
          <div>
            <ul>
              <li>Người đánh giá : {identifier?.nameMarker}</li>
              <li>SDT người đánh giá : {identifier?.phoneMarker}</li>
              <li>Đối tượng đánh giá : {department?.name}</li>
              <li>
                Đổi thông tin tại : <Link to={"/rating/identify"}>Đây</Link>
              </li>
            </ul>
          </div>
        }
        message={`Bạn đang đánh giá với tư cách :`}
      ></Alert>
      <Card title={`${user?.fullName}`}>
        <div className="grid grid-cols-3">
          <div>
            <Image
              height={150}
              className="object-cover"
              src={user?.avatar}
            ></Image>
          </div>
          <div className="col-span-2">
            <ul>
              <li>Mã NV: {user?.username}</li>
              <li>Tên: {user?.fullName}</li>
              <li>
                Ngày sinh: {user?.dob && dayjs(user?.dob).format("DD/MM/YYYY")}
              </li>
              <li>
                Ngày training:{" "}
                {user?.dateTraining &&
                  dayjs(user?.dateTraining).format("DD/MM/YYYY")}
              </li>
              <li>
                Ngày pass h.việc:{" "}
                {user?.dateToWork &&
                  dayjs(user?.dateToWork).format("DD/MM/YYYY")}
              </li>
            </ul>
          </div>
        </div>
      </Card>
      <Divider orientation="left">
        <div className="text-xl font-bold">
          {currentRating
            ? `Điểm đánh giá (${currentRating?.totalPoint})`
            : "Đánh giá"}
        </div>
      </Divider>
      <Spin spinning={isLoading}>
        <div>
          <Form
            scrollToFirstError={{
              behavior: "smooth",
            }}
            //   disabled={isLoading || !!currentQues}
            form={form}
            name="basic"
            // initialValues={initData}
            onFinish={onFinish}
            onFinishFailed={(d) => {
              // console.log(d);
            }}
            // onFinish={initData ? onUpdate : onFinish}
            autoComplete="off"
            layout="vertical"
          >
            <div className="radio-group-block p-2">
              {questions?.map((e) => {
                const option = e?.option?.filter((e) => {
                  // if (!e?.exceptDepartmentIds) return true;
                  return !e?.exceptDepartmentIds?.includes(
                    currentDepartmentIdRating
                  );
                });

                return (
                  <div className="" key={e?._id}>
                    <Form.Item
                      name={["data", e?._id, "checked"]}
                      valuePropName="checked"
                    >
                      <Checkbox>{e?.name}</Checkbox>
                    </Form.Item>
                    <Form.Item
                      initialValue={e?.point}
                      style={{ display: "none" }}
                      name={["data", e?._id, "point"]}
                    >
                      <Input></Input>
                    </Form.Item>
                  </div>
                );
              })}
              <Card>
                <SingleImageUpload
                  capture="user"
                  rules={[{ required: true, message: "Vui lòng upload ảnh" }]}
                  label="Hình ảnh"
                  name="image"
                />
              </Card>
            </div>
            <div className="flex justify-center mt-2">
              <Button htmlType="submit" type="primary">
                Đánh giá
              </Button>
            </div>
          </Form>
        </div>
      </Spin>
    </div>
  );
};

export default PolicyUserPage;
