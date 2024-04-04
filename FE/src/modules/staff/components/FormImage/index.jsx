import SingleImageUpload from "@components/SingleImageUpload";
import { array2Object } from "@helper/array2Obj";
import useGetGroupimage from "@modules/manager/groupimages/hooks/query/useGetGroupimage";
import useGetImage from "@modules/manager/images/hooks/query/useGetImage";
import useGetProduct from "@modules/manager/products/hooks/query/useGetProduct";
import { Button, Card, Collapse, Form, Input } from "antd";
import CollapsePanel from "antd/es/collapse/CollapsePanel";
import React from "react";

const FormImage = ({ onFinish, form, isLoading }) => {
  const { data: images, isLoading: loadingProduct } = useGetImage();
  const { data: groups } = useGetGroupimage();
  const mappingGroup = array2Object(groups, "_id");
  return (
    <div>
      <Form
        labelCol={{ flex: "120px" }}
        wrapperCol={{
          flex: 1,
        }}
        labelAlign="left"
        labelWrap={true}
        onFinish={onFinish}
        form={form}
      >
        <Collapse accordion>
          {groups?.map((g) => {
            return (
              <CollapsePanel header={g?.name} key={g?.name}>
                <Card>
                  {images
                    ?.filter((e) => e?.groupId === g?._id)
                    ?.map((e) => {
                      return (
                        <SingleImageUpload
                          key={e?._id}
                          capture="user"
                          name={["dataImage", e?._id]}
                          label={e?.name}
                        ></SingleImageUpload>
                      );
                    })}
                  <div className="flex justify-center mt-2">
                    <Button
                      loading={isLoading}
                      type="primary"
                      htmlType="submit"
                    >
                      Hoàn tất
                    </Button>
                  </div>
                </Card>
              </CollapsePanel>
            );
          })}
        </Collapse>
        <div className="flex justify-center mt-2">
          <Button loading={isLoading} type="primary" htmlType="submit">
            Hoàn tất
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default FormImage;
