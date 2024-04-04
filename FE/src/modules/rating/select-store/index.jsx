import { Avatar, Card, Input, List, Select } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";

import dayjs from "dayjs";
import useGetStore from "@modules/manager/stores/hooks/query/useGetStore";
import { PageHeader } from "@ant-design/pro-components";
import CustomPageHeader from "@components/CustomPageHeader";
const { Option } = Select;
const SelectStorePage = () => {
  const { projectId } = useParams();
  const nav = useNavigate();
  const { data: storeData } = useGetStore();
  const onChange = (v) => {
    nav(`/project-submit/${projectId}/submit/${v}`);
  };
  const [search, setSearch] = useState("");
  const stores = useMemo(() => {
    return storeData?.data?.filter((val) =>
      val?.name?.toLowerCase().includes(search?.toLowerCase())
    );
  }, [storeData, search]);
  // useEffect(() => {
  //   if (stores?.length === 1) {
  //     nav(`/project-submit/${projectId}/submit/${stores?.[0]?._id}`);
  //   }
  // }, [stores, nav, projectId]);

  return (
    <div>
      <CustomPageHeader title="Cửa hàng" />
      <div className="p-4">
        <div className="flex justify-center items-center">
          <div>
            <h1 className="text-center">Vui lòng chọn một store để tiếp tục</h1>
            <div className="mb-2">
              <Input
                placeholder="Tìm kiếm"
                value={search}
                onChange={(e) => setSearch(e?.target?.value)}
              />
            </div>
            <div className="">
              {/* <Select onChange={onChange} style={{ width: 200 }}>
              {stores?.map((e, index) => (
                <Option value={e?._id}>{e?.name}</Option>
              ))}
            </Select> */}
              <div className="">
                <Card>
                  <List
                    itemLayout="vertical"
                    dataSource={stores}
                    renderItem={(item, index) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={
                            <Avatar
                              style={{
                                backgroundColor: "#f56a00",
                              }}
                            >
                              {item?.name?.charAt(0)}
                            </Avatar>
                          }
                          title={
                            <Link to={`/rating/stores/${item?._id}`}>
                              {" "}
                              {item.name}
                            </Link>
                          }
                          description={
                            <div>
                              <p>{item?.description}</p>
                              {/* {item?.timeCheckIn && (
                              <p>
                                Checkint At :
                                {dayjs(item?.timeCheckIn).format(
                                  "DD/MM/YYYY H:m:s"
                                )}
                              </p>
                            )}
                            {item?.timeCheckOut && (
                              <p>
                                Checkout At :
                                {dayjs(item?.timeCheckOut).format(
                                  "DD/MM/YYYY H:m:s"
                                )}
                              </p>
                            )} */}
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectStorePage;
