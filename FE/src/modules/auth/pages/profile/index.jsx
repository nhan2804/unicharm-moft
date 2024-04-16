import CustomPageHeader from "@components/CustomPageHeader";
import { useAppSelector } from "@hooks/reduxHook";
import { Card, Image, Input, Button, message } from "antd";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import useUpdateUser from "@modules/auth/hooks/useUpdateUser";

const ProfilePage = () => {
  const user = useAppSelector((s) => s?.auth?.user);
  const format = "DD/MM/YYYY";
  // <b>{user?.phone}</b>
  const [value, setvalue] = useState();
  useEffect(() => {
    setvalue(user?.phone);
  }, [user]);
  const { mutate: update, isLoading } = useUpdateUser();
  const onChangeSdt = () => {
    if (!value) return;
    const regexPhoneNumber = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;

    const rs = value?.match(regexPhoneNumber) ? true : false;
    if (!rs) {
      alert("Vui lòng nhập đúng SDT");
      return;
    }
    update(
      { phone: value },
      {
        onSuccess: () => {
          message.success("Cập nhật thành công");
          window.location.reload();
        },
      }
    );
  };
  return (
    <div className="p-2">
      <CustomPageHeader title="Thông tin nhân sự"></CustomPageHeader>
      <Card title={user?.fullName}>
        <div className="flex justify-center">
          <Image className="text-center" width={100} src={user?.avatar}></Image>
        </div>
        <h3>Thông tin cơ bản</h3>

        <ul>
          <li>
            Username/Code : <b>{user?.username}</b>
          </li>
          <li>
            Tên : <b>{user?.fullName}</b>
          </li>
          {/* {user?.type === "PG" && (
            <li>
              SDT :{" "}
              <Input
                value={value}
                onChange={(e) => setvalue(e?.target?.value)}
              />
              <Button
                className="mt-1"
                type="primary"
                loading={isLoading}
                onClick={onChangeSdt}
              >
                Cập nhật
              </Button>
            </li>
          )} */}
          {/* <li>
            Loại : <b>{user?.type}</b>
          </li> */}
          {/* <li>
            Ngày sinh :{" "}
            <b>{user?.dob ? dayjs(user?.dob).format(format) : "---"}</b>
          </li> */}
        </ul>
        {/* <h3>Thông tin thêm</h3> */}

        {/* <ul>
          <li>
            Số CMND/CCCD : <b>{user?.info?.cccd}</b>
          </li>
          <li>
            Ngày cấp :{" "}
            <b>
              {user?.info?.dateCccd
                ? dayjs(user?.info?.dateCccd).format(format)
                : "---"}
            </b>
          </li>
          <li>
            Nơi cấp : <b>{user?.info?.whereCccd}</b>
          </li>
          <li>
            Địa chỉ CCCD : <b>{user?.info?.addressCccd}</b>
          </li>
          <li>
            Địa chỉ ở hiện tại : <b>{user?.info?.currentAddress}</b>
          </li>
          <li>
            Mã số thuế : <b>{user?.info?.taxCode}</b>
          </li>
          <li>
            Ngân hàng : <b>{user?.info?.bankName}</b>
          </li>
          <li>
            Chi nhánh mở Ngân hàng: <b>{user?.info?.bankBranch}</b>
          </li>
          <li>
            STK ngân hàng: <b>{user?.info?.bankNumber?.replaceAll('"', "")}</b>
          </li>
          <li>
            Code bank: <b>{user?.info?.bankCode}</b>
          </li>
          <li>
            Ngày trình diện :{" "}
            <b>
              {user?.dateToPresent
                ? dayjs(user?.dateToPresent).format(format)
                : "---"}
            </b>
          </li>
          <li>
            Ngày làm việc :{" "}
            <b>
              {user?.dateToWork
                ? dayjs(user?.dateToWork).format(format)
                : "---"}
            </b>
          </li>
        </ul> */}
      </Card>
    </div>
  );
};

export default ProfilePage;
