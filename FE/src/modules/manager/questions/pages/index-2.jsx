import BaseFormAction from "@components/base/BaseFormAction";
import CustomDrawer from "@components/CustomDrawer";
import useQueryString2 from "@hooks/useQueryString2";
import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Radio,
  Select,
  Table,
  message,
} from "antd";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  PlusCircleOutlined,
  SearchOutlined,
  CopyOutlined,
  SaveOutlined,
  EyeOutlined,
  EditOutlined,
} from "@ant-design/icons";
import useCreatePlace from "@modules/projects/hooks/mutate/useCreatePlace";
import { useParams } from "react-router";
import useGetPlace from "@modules/projects/hooks/query/useGetPlace";
import usePagination from "@hooks/usePagination";
import useCreateOption from "@modules/projects/hooks/mutate/useCreateOption";
import useGetOptions from "@modules/projects/hooks/query/useGetOptions";
import useDeleteOption from "@modules/projects/hooks/mutate/useDeleteOption";
import { DeleteOutlined } from "@ant-design/icons";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import useGetQcs from "@modules/projects/hooks/query/useGetQc";
import useGetGroupQuestion from "@modules/projects/hooks/query/useGetGroupQuestion";
import { Link } from "react-router-dom";
import useUpdateOption from "@modules/projects/hooks/mutate/useUpdateOption";
import { DndContext } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import useChangePositionOption from "@modules/projects/hooks/mutate/useChangePositionOption";
import CustomModal from "@components/CustomModal";
import FormSubmitComp from "@modules/submit/components/FormSubmitComp";
import { array2Object } from "@helper/array2Obj";
import useGetGroupUser from "@modules/projects/hooks/query/useGetGroupUser";
import CustomRowTable from "@components/Row";
import useRole from "@hooks/useRole";
import copyText from "@helper/copyText";
import QuestionFormCreate from "../components/Form";
export const typesDirection = [
  { label: "Chiều dọc", value: "VERTICAL" },
  {
    label: "Chiều ngang",
    value: "HORIZONTAL",
  },
  // {
  //   label: "Mặc định",
  //   value: "",
  // },
];
export const mappingTypeDirection = array2Object(typesDirection, "value");
export const listTypeOption = [
  {
    label: "Chọn một",
    value: "SINGLE",
  },
  {
    label: "Chọn nhiều",
    value: "MULTI",
  },
  {
    label: "Text/Input",
    value: "INPUT",
  },
  {
    label: "Ảnh",
    value: "UPLOAD",
  },
];
export const listTypeValue = {
  MULTI: [
    {
      label: "Dropdown",
      value: "MULTI_DROPDOWN",
      formItem: "LIST",
    },
    {
      label: "Checkbox",
      value: "MULTI_CHECKBOX",
      formItem: "CHECKBOX",
    },
  ],
  SINGLE: [
    {
      label: "Dropdown",
      value: "SINGLE_DROPDOWN",
      formItem: "LIST",
    },
    {
      label: "Radio",
      value: "SINGLE_RADIO",
      formItem: "RADIO",
    },
  ],
  INPUT: [
    {
      label: "Ngắn",
      value: "SHORT_INPUT",
      formItem: "TEXT",
    },
    {
      label: "Dài",
      value: "LONG_RADIO",
      formItem: "LONG_TEXT",
    },
  ],
};
const QuestionHomePage = () => {
  const { projectId } = useParams();
  const { qsParsed } = useQueryString2();
  const [form] = Form.useForm();
  // const { current, onChange, pageSize, sort, onChangeTable, tableSortOrder } =
  //   usePagination({});

  const { mutate: create } = useCreateOption(projectId);
  const { mutate: updateOption } = useUpdateOption(projectId);
  const { mutate: deleteOption } = useDeleteOption(projectId);
  const { data: optionss } = useGetOptions(projectId);
  const [options, setOptions] = useState(optionss);
  useEffect(() => {
    setOptions(optionss);
  }, [optionss]);

  const { data: groups } = useGetGroupQuestion(projectId);

  const mappingGroup = useMemo(() => {
    return array2Object(groups, "_id");
  }, [groups]);
  const onCreate = (v, c) => {
    console.log({ v });

    create(v, { onSuccess: c });
  };
  const onDelete = (id) => {
    deleteOption(id);
  };
  const onEdit = (value, c) => {
    updateOption(
      { ...value, _id: selected?._id, groupId: value?.groupId || "" },
      {
        onSuccess: c,
      }
    );
  };
  const refPreviewForm = useRef();
  const ref = useRef();
  // const { data: qcs } = useGetQcs(projectId);
  const [selected, setSelected] = useState(null);
  const __ = useRole();
  const columns = [
    {
      key: "sort",
    },
    {
      key: "STT",
      title: "STT",
      dataIndex: "stt",
      render: (_, __, stt) => stt + 1 + ".",
    },
    {
      title: "Câu hỏi",
      dataIndex: "name",
      key: "name",
      width: 300,
    },
    {
      title: "Bắt buộc",
      dataIndex: "required",
      key: "required",
      render: (txt) => {
        return !!txt ? "Có" : "Không";
      },
    },

    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Kiểu",
      dataIndex: "type",
      key: "type",
      render: (text, record) => {
        return text;
      },
    },
    {
      title: "Hướng",
      dataIndex: "layout",
      key: "layout",
      // render: (text, record) => {
      //   return mappingTypeDirection?.[text]?.label || "";
      // },
    },
    {
      title: "Nhóm",
      dataIndex: "groupId",
      key: "groupId",
      width: 40,
      render: (text, record) => {
        return (
          <span
            title={mappingGroup?.[text]?.name || ""}
            className="line-clamp-1"
          >
            {mappingGroup?.[text]?.name || ""}
          </span>
        );
      },
    },
    {
      title: "Loại trừ",
      dataIndex: "except",
      key: "except",

      render: (text, record) => {
        return (
          <ul>
            {text?.map((e) => {
              return <li key={e?._id}>{e?.name}</li>;
            })}
          </ul>
        );
      },
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <div>
          {__.canReadAndWrite && (
            <div className="flex gap-x-1">
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={async () => {
                  setSelected(record);
                  form.setFieldsValue(record);
                  // await new Promise((resolve) => setTimeout(resolve, 200));
                  ref?.current?.open?.();
                }}
              ></Button>
              <Button
                type="dashed"
                icon={<CopyOutlined />}
                onClick={() => {
                  create({
                    ...record,
                    _id: undefined,
                    createdAt: undefined,
                    updatedAt: undefined,
                  });
                }}
              >
                Clone
              </Button>
              <Popconfirm
                title="Xóa record này?, Sẽ không thể hoàn tác"
                onConfirm={() => {
                  onDelete(record._id);
                }}
              >
                <Button danger type="primary" icon={<DeleteOutlined />}>
                  Xóa
                </Button>
              </Popconfirm>
            </div>
          )}
        </div>
      ),
    },
  ];
  const watchType = Form.useWatch("type", form);
  const watchKind = Form.useWatch("kind", form);
  const noOption = watchType === "INPUT";
  const typeValue = listTypeValue?.[watchType];

  const { mutate: changePosOption, isLoading: loadingChangePos } =
    useChangePositionOption(projectId);
  const onUpdatePosition = () => {
    const data = options.map((e, i) => {
      return { _id: e?._id, postition: i + 1 };
    });
    changePosOption(data, {
      onSuccess: () => {
        message.success("Lưu thành công");
      },
    });
  };
  const [isChangePost, setisChangePost] = useState(false);
  const onDragEnd = ({ active, over, activatorEvent, delta, collisions }) => {
    console.log({ active, over, collisions });
    if (active.id !== over?.id) {
      setOptions((previous) => {
        const activeIndex = previous.findIndex((i) => i._id === active.id);
        const overIndex = previous.findIndex((i) => i._id === over?.id);
        return arrayMove(previous, activeIndex, overIndex);
      });
      setisChangePost(true);

      // const activeOption = options?.find((i) => i._id === active.id);
      // const overOption = options?.find((i) => i._id === over?.id);
      // console.log({ activeOption, overOption });
      // const positionShoudUpdate =
      //   Math.max(activeOption?.position, overOption?.position) || 0;
      // updateOption({
      //   _id: activeOption?._id,
      //   position: positionShoudUpdate - 1,
      // });
    }
  };
  const { data: groupsUser } = useGetGroupUser(projectId);
  const onCopyColor = () => {
    const op = form.getFieldValue("option");
    const obj = array2Object(op, "value", "color");

    copyText(JSON.stringify(obj), {
      onSucess: () => {
        message.success("Copy thành công");
      },
    });
  };
  const onChangeColor = (e) => {
    const value = e.target.value;
    try {
      const colors = JSON.parse(value);
      const op = form.getFieldValue("option");
      const finalOp = op?.map((e) => {
        return { ...e, color: colors?.[e?.value] };
      });
      form.setFieldValue("option", finalOp);
    } catch (error) {
      message.error("Có lỗi xảy ra, " + error?.message);
    }
  };
  return (
    <div>
      {/* <OptionHome /> */}
      <div className="flex justify-between mb-1">
        <div>
          <CustomModal
            ref={refPreviewForm}
            title={"Xem trước form"}
            // key={record?.updatedAt + record?._id}
            destroyOnClose={true}
            footer={false}
            width={800}
            button={({ open }) => (
              <Button icon={<EyeOutlined />} onClick={open} type="primary">
                Xem trước form
              </Button>
            )}
          >
            {({ close }) => (
              <FormSubmitComp
                isPreview
                close={close}
                // _id={selected?._id}
                // placeId={selected?.placeId}
                projectId={projectId}
              />
            )}
          </CustomModal>
        </div>
        <div>
          <div className="flex justify-end mb-2 space-x-2">
            {__.canReadAndWrite && isChangePost && (
              <Button
                onClick={onUpdatePosition}
                icon={<SaveOutlined />}
                danger
                loading={loadingChangePos}
                type="dashed"
              >
                Lưu thay đổi vị trí
              </Button>
            )}

            {__.canReadAndWrite && (
              <CustomModal
                width={600}
                footer={false}
                button={({ open }) => (
                  <Button onClick={open} icon={<PlusOutlined />} type="primary">
                    Tạo mới
                  </Button>
                )}
                title={"Tạo question"}
              >
                {({ close }) => (
                  <QuestionFormCreate
                    okText={"Tạo"}
                    onFinish={(v) => onCreate(v, close)}
                    loading={isLoadingCreate}
                  />
                )}
              </CustomModal>
            )}
          </div>
        </div>
      </div>
      <DndContext onDragEnd={onDragEnd}>
        <SortableContext
          // rowKey array
          items={(options || [])?.map((i) => i?._id)}
          strategy={verticalListSortingStrategy}
        >
          <Table
            size="small"
            pagination={false}
            components={{
              body: {
                row: CustomRowTable,
              },
            }}
            rowKey="_id"
            columns={columns}
            dataSource={options}
          />
        </SortableContext>
      </DndContext>
      {/* <Table pagination={false} columns={columns} dataSource={options} /> */}
    </div>
  );
};

export default QuestionHomePage;
