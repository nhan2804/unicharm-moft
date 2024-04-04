import WrapFormItem from "@components/WrapFormItem";
import { array2Group, array2Object } from "@helper/array2Obj";
import { useAppSelector } from "@hooks/reduxHook";
import useUpdatePlace from "@modules/projects/hooks/mutate/useUpdatePlace";
import useGetGroupQuestion from "@modules/projects/hooks/query/useGetGroupQuestion";
import useGetOptions from "@modules/projects/hooks/query/useGetOptions";
import useShowPlace from "@modules/projects/hooks/query/useShowPlace";
import { listTypeValue } from "@modules/projects/pages/option";
import useSubmitOption from "@modules/submit/hooks/mutate/useSubmitOption";
import useUpdateCheckIn from "@modules/submit/hooks/mutate/useUpdateCheckIn";
import useUpdateSubmitOption from "@modules/submit/hooks/mutate/useUpdateSubmitOption";
import useGetSubmit from "@modules/submit/hooks/query/useGetSubmit";
import useShowCheckIn from "@modules/submit/hooks/query/useShowCheckIn";
import logo from "@assets/logo.jpg";
import {
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  QRCode,
  Switch,
  Table,
  message,
  Typography,
  theme,
} from "antd";
import classNames from "classnames";
import React, { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
const { Paragraph } = Typography;
const { useToken } = theme;
function sameDay(d1, d2) {
  return (
    d1.getUTCFullYear() === d2.getUTCFullYear() &&
    d1.getUTCMonth() === d2.getUTCMonth() &&
    d1.getUTCDate() === d2.getUTCDate()
  );
}

const SubmitForm = ({ initProject }) => {
  const { projectId, placeId } = useParams();
  const { data: options } = useGetOptions(projectId);
  const { mutate: submit, isLoading: loadingCreate } = useSubmitOption(
    projectId,
    placeId
  );
  const { data: checkIn, isLoading: loadingCheckin } = useShowCheckIn(
    projectId,
    placeId
  );

  const nav = useNavigate();
  // useEffect(() => {
  //   if (!checkIn && !loadingCheckin) {
  //     nav(`/project-submit/${projectId}/checkin/${placeId}/`);
  //   }
  // }, [checkIn, nav, placeId, projectId, loadingCheckin]);

  // const { data: dataSubmited, isLoading } = useGetSubmit(projectId, placeId);
  const { mutate: updateSubmit, isLoading: loadingUpdate } =
    useUpdateSubmitOption(projectId, placeId);

  const { data: place } = useShowPlace(projectId, placeId);
  const user = useAppSelector((s) => s?.auth?.user);

  const [form] = Form.useForm();

  const onFinish = (values) => {
    submit(
      {
        data: values,
        checkInId: checkIn?._id,
      },
      {
        onSuccess: () => {
          message.success("Lưu thay đổi thành công!");
          form.resetFields();
        },
      }
    );
  };
  const onCreateBtn = () => {
    form.submit();
  };
  // const onUpdate = (values) => {
  //   console.log({ values });
  //   updateSubmit({ _id: dataSubmited?._id, formData: values });
  // };

  // const initData = useMemo(() => {
  //   return dataSubmited?.data;
  // }, [dataSubmited]);
  const { mutate: checkOutFn, isLoading: loadingCheckout } = useUpdateCheckIn(
    projectId,
    placeId
  );
  const onCheckout = () => {
    checkOutFn(
      {
        updateTimeCheckOut: true,
        _id: checkIn?._id,
      },
      {
        onSuccess: () => {
          nav(`/project-submit/${projectId}`);
        },
      }
    );
  };
  const { token } = useToken();
  const urlQR = `${window.origin}/consumer/login?store=${placeId}`;
  return (
    <div className="p-2 bg-gray-200 h-full">
      <Card className="mb-2">
        <div className="">
          {/* <div className="sticky top-10">
            <div className="flex justify-end">
              <Button
                loading={loadingCheckout}
                onClick={onCheckout}
                danger
                type="primary"
              >
                CheckOut
              </Button>
            </div>
          </div> */}

          <p>
            Bạn đang làm tại địa điểm :{" "}
            <span className="font-semibold">{place?.name}</span>, đổi địa điểm
            tại{" "}
            <Link className="font-semibold" to={`/project-submit/${projectId}`}>
              ĐÂY
            </Link>
          </p>
        </div>
      </Card>

      {/* {!isLoading && ( */}
      <>
        <div className="flex justify-center mt-12 text-center">
          <Card>
            <div className="font-bold">{place?.name}</div>
            <QRCode
              // icon={`https://logowik.com/content/uploads/images/109_heineken.jpg`}
              color={token.colorPrimary}
              size={300}
              value={urlQR}
            />
            <div className="font-bold">Quét mã để tham gia chương trình</div>
          </Card>
        </div>
        {/* <Paragraph
          copyable={{
            text: urlQR,
          }}
        >
          Copy link
        </Paragraph> */}
      </>
      {/* )} */}
    </div>
  );
};

export default SubmitForm;
