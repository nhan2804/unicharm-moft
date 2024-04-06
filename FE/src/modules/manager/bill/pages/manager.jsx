import CustomDrawer from "@components/CustomDrawer";
import {
  SearchOutlined,
  EditOutlined,
  PlusCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useAppSelector } from "@hooks/reduxHook";

import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Image,
  Input,
  InputNumber,
  Select,
  Table,
  Tabs,
} from "antd";
import React, { useMemo, useRef, useState } from "react";
import { useMatch, useNavigate, useParams } from "react-router";
import dayjs from "dayjs";
import useQueryString2 from "@hooks/useQueryString2";
import useSearchQuery from "@hooks/useSearchQuery";
import usePagination from "@hooks/usePagination";
import { useEffect } from "react";
import PrismaZoom from "react-prismazoom";
import useRole from "@hooks/useRole";
import useGetBill from "../hooks/query/useGetBill";
import useUpdateBill from "../hooks/mutate/useUpdateBill";
import useGetStore from "@modules/manager/stores/hooks/query/useGetStore";
import FormAcceptBill from "../components/FormBill";
import useCreateProduct from "@modules/manager/products/hooks/mutate/useCreateProduct";
import useGetProduct from "@modules/manager/products/hooks/query/useGetProduct";

const ManagerBill = () => {
  const userId = useAppSelector((s) => s?.auth?.user?._id);
  const { projectId } = useParams();
  const match = useMatch("/projects/:projectId/:page");
  const [form] = Form.useForm();
  const [form2] = Form.useForm();

  const { initSearchValues, search, setSearch } = useSearchQuery();
  const pagination = usePagination({ reset: Object.keys(search) });
  const qstring = useQueryString2();
  const initTab = qstring.qsParsed?.tab || "PENDING";
  const [tab, setTab] = useState(initTab);
  const { data: bill, isLoading: loadingBill } = useGetBill(
    {
      ...search,
      managerId: match?.params?.page === "bills" ? undefined : userId,
      status: tab,
      tab: undefined,
      page: pagination?.current,
      perPage: pagination?.pageSize,
    },
    tab === "PENDING"
  );
  useEffect(() => {
    const num = bill?.data?.filter((e) => e?.status === "PENDING")?.length;
    console.log({ num });
    if (num) {
      //   showNotiWebApi({
      //     title: `Thông báo bill chờ duyệt`,
      //     content: `Có ${num} bill đang chờ duyệt`,
      //     icon: logo,
      //   });
    }
  }, [bill]);

  const [selected, setSelected] = useState();
  const { mutate: update, isLoading } = useUpdateBill();
  const __ = useRole();

  const onAcceptBill = (v) => {};
  const columns = [
    // {
    //   title: "Số điện thoại",
    //   dataIndex: "phone",
    //   key: "phone",
    // },
    // {
    //   title: "Code",
    //   dataIndex: "fromCode",
    //   key: "fromCode",
    // },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      //   render: (_, __, index) => <MappingStatus text={_} />,
    },
    {
      title: "Ảnh bill",
      dataIndex: "bill",
      key: "bill",
      render: (text, record) => <Image width={100} src={text} />,
    },
    tab === "DENY"
      ? {
          title: "Lý do",
          dataIndex: "reasonBill",
          key: "reasonBill",
        }
      : undefined,
    tab === "ACCEPTED"
      ? {
          title: "Ca",
          dataIndex: "shift",
          key: "shift",
          //   render: (t) => mappingShift?.[t] || "",
        }
      : undefined,
    {
      title: "Store",
      dataIndex: "place",
      key: "place",
      render: (text) => text?.name,
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
    {
      title: "Kiểm tra lần cuối",
      dataIndex: "dateCheckingBill",
      key: "dateCheckingBill",
      render: (text) => (text ? dayjs(text).format("DD/MM/YYYY HH:mm:ss") : ""),
    },
    {
      title: "Mã bill",
      dataIndex: "codeBill",
      key: "codeBill",
    },
    {
      title: "Ngày bill",
      dataIndex: "dateBill",
      key: "dateBill",
    },
    {
      title: "C.sửa l.cuối",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (text) => dayjs(text).format("DD/MM/YYYY H:m:s"),
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <div className="flex gap-x-1">
          {/* && record?.status === "PENDING" */}
          {record?.status === "PENDING" && (
            <>
              <Button
                type="primary"
                loading={isLoading}
                onClick={() => {
                  // update({ _id: record?._id, status: "ACCEPTED" });
                  setSelected({ ...record, type: "ACCEPTED" });
                  ref?.current?.open?.();
                }}
              >
                Duyệt
              </Button>
              <Button
                onClick={() => {
                  // update({ _id: record?._id, status: "ACCEPTED" });
                  setSelected({ ...record, type: "DENY" });
                  ref?.current?.open?.();
                }}
                type="primary"
                danger
              >
                Từ chối
              </Button>
            </>
          )}
        </div>
      ),
    },
  ].filter((e) => !!e);
  const ref = useRef();
  const projectIdUser = useAppSelector((s) => s?.auth?.user?.projectId);
  const nav = useNavigate();
  const { data: places } = useGetStore(projectId || projectIdUser);
  const handleAcceptBill = (value, c) => {
    const data = value?.data?.reduce((all, e) => {
      all[e?.product] = all[e?.product] || 0;
      all[e?.product] += Number(e?.quantity);
      return all;
    }, {});
    update(
      {
        ...value,
        data,
        dateBill: dayjs(value?.dateBill)?.format("DD-MM-YYYY"),
        _id: selected?._id,
        // status: "ACCEPTED",
      },
      { onSuccess: c }
    );
  };
  const { data: products } = useGetProduct({
    isSale: true,
  });
  console.log({ products });
  const idPlaces = bill?.idPlaces;
  const finalDataPlace = useMemo(() => {
    if (!idPlaces) return places;
    return places?.filter((e) => idPlaces?.includes(e?._id));
  }, [idPlaces, places]);
  console.log({ finalDataPlace });
  //   const restPagi = useShowTotalTable();

  return (
    <>
      <Tabs
        onChange={(k) => {
          setTab(k);
          nav(match.pathname + "?tab=" + k);
        }}
        defaultActiveKey={initTab}
        items={[
          {
            label: <span>Bill đã từ chối</span>,
            key: "DENY",
            children: <></>,
          },
          {
            label: <span>Bill đã duyệt</span>,
            key: "ACCEPTED",
            children: <></>,
          },
          {
            label: <span>Bill chờ duyệt</span>,
            key: "PENDING",
            children: <></>,
          },
        ]}
      />
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
            <Form.Item name="fromCode">
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
            <Form.Item name="placeId">
              <Select
                allowClear
                showSearch
                // filterOption={searchSelectOption}
                placeholder="Địa điểm / Store"
              >
                {/* {(finalDataPlace || places)?.map((e) => {
                  return (
                    <Select.Option key={e?._id} value={e?._id}>
                      {e?.name}
                    </Select.Option>
                  );
                })} */}
              </Select>
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
      <CustomDrawer width={560} ref={ref} noButton title={"Đồng ý duyệt bill"}>
        {({ close }) => (
          <>
            <FormAcceptBill
              products={products?.data}
              selected={selected}
              onFinish={(v) => handleAcceptBill(v, close)}
            />
            <div className="overflow-hidden">
              <PrismaZoom>
                <img alt="" className="w-full" src={selected?.imgBill} />
              </PrismaZoom>
            </div>
          </>
        )}
      </CustomDrawer>
      {/* <PageHeader title="Lịch sử tham gia" onBack={() => nav(-1)} /> */}
    </>
  );
};

export default ManagerBill;
