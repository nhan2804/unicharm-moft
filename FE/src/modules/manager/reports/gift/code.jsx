import { SearchOutlined } from "@ant-design/icons";
import { useAppSelector } from "@hooks/reduxHook";

import { Button, Form, Image, Input, Select, Table, Tabs } from "antd";
import React, { useMemo, useRef, useState } from "react";
import { useMatch, useNavigate, useParams } from "react-router";
import dayjs from "dayjs";
import useQueryString2 from "@hooks/useQueryString2";
import useSearchQuery from "@hooks/useSearchQuery";
import usePagination from "@hooks/usePagination";

import useGetStore from "@modules/manager/stores/hooks/query/useGetStore";

import useGetShift from "@modules/staff/hooks/query/useGetShift";
import { array2Object } from "@helper/array2Obj";
import useGetBill from "@modules/manager/bill/hooks/query/useGetBill";
import CustomPageHeader from "@components/CustomPageHeader";

const CodeGiftClient = () => {
  const userId = useAppSelector((s) => s?.auth?.user?._id);
  const { projectId } = useParams();

  const [form] = Form.useForm();
  const [form2] = Form.useForm();

  const { initSearchValues, search, setSearch } = useSearchQuery();
  const pagination = usePagination({ reset: Object.keys(search) });
  const qstring = useQueryString2();
  const initTab = qstring.qsParsed?.tab || "PENDING";
  const [tab, setTab] = useState(initTab);
  // const {data:shifts} = useGetShift()
  const { data: shifts } = useGetShift();
  const { data: stores } = useGetStore();
  const mappingShift = useMemo(() => {
    return array2Object(shifts, "_id", "name");
  }, [shifts]);
  const mappingStores = useMemo(() => {
    return array2Object(stores?.data, "_id", "name");
  }, [stores]);
  const { data: bill, isLoading: loadingBill } = useGetBill(
    {
      ...search,
      page: pagination?.current,
      perPage: pagination?.pageSize,
    },
    false
  );

  const columns = [
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      //   render: (_, __, index) => <MappingStatus text={_} />,
    },

    {
      title: "Store",
      dataIndex: "storeId",
      key: "storeId",
      render: (text) => mappingStores?.[text],
    },
    // {
    //   title: "Mã giới thiệu",
    //   dataIndex: "staff",
    //   key: "staff",
    //   render: (text) => text?.ref,
    // },
    // {
    //   title: "Nhân viên",
    //   dataIndex: "staff",
    //   key: "staff",
    //   render: (text) => text?.fullName,
    // },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => dayjs(text).format("DD/MM/YYYY H:m:s"),
    },
  ].filter((e) => !!e);
  const ref = useRef();
  const projectIdUser = useAppSelector((s) => s?.auth?.user?.projectId);
  const nav = useNavigate();
  const { data: places } = useGetStore(projectId || projectIdUser);

  return (
    <>
      <CustomPageHeader title="Mã code" />
      <div className="flex justify-end mb-2">
        <Form
          onFinish={setSearch}
          form={form}
          layout="inline"
          initialValues={initSearchValues}
          autoComplete="off"
        >
          <div className="flex flex-wrap items-center gap-x-1 gap-y-1 [&>*]:!m-0 !space-x-reverse form-no-margin">
            <Form.Item name="phone">
              <Input placeholder="Số điện thoại" />
            </Form.Item>
            <Form.Item name="code">
              <Input placeholder="Mã dự thưởng" />
            </Form.Item>
            {/* <Form.Item name="status">
              <Select allowClear placeholder="Trạng thái">
                {[
                  mappingStatus.PENDING,
                  mappingStatus.DENY,
                  mappingStatus.ACCEPTED,
                ].map((e) => {
                  return (
                    <Select.Option value={e?.value}>{e?.label}</Select.Option>
                  );
                })}
              </Select>
            </Form.Item> */}
            <Form.Item name="codeBill">
              <Input placeholder="Mã bill" />
            </Form.Item>

            <Form.Item>
              <Button
                icon={<SearchOutlined />}
                type="primary"
                htmlType="submit"
              >
                Tìm
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
      <Table
        rowKey={"_id"}
        pagination={{
          ...pagination,
          total: bill?.paginate?.count,
          //   ...restPagi,
        }}
        loading={loadingBill}
        columns={columns}
        dataSource={bill?.data}
      />

      {/* <PageHeader title="Lịch sử tham gia" onBack={() => nav(-1)} /> */}
    </>
  );
};

export default CodeGiftClient;
