import Checkbox from "antd/es/checkbox";
import DatePicker from "antd/es/date-picker";
import Input from "antd/es/input";
import Radio from "antd/es/radio";
import Select from "antd/es/select";
import Form, { FormInstance } from "antd/es/form";
import InputNumber from "antd/es/input-number";
import React, { useState } from "react";
import { FormComponentProps } from "antd/lib/form/Form";
import SingleImageUpload from "@components/SingleImageUpload";
import { Rate, Switch } from "antd";

const { Option } = Select;
export interface StructFormItem extends FormComponentProps {
  type:
    | "TEXT"
    | "RATE"
    | "LONG_TEXT"
    | "SWITCH"
    | "NUMBER"
    | "CHECKBOX"
    | "RADIO"
    | "LIST"
    | "IMAGE"
    | "DATE"
    | "DATE_TIME"
    | "single-checkbox";
  label: string | React.Node;
  placeholder: string;
  options: { name: string; value: string }[] | string[];
  name: string;
  value: string;
  rules: any;
  mode?: "tags" | "multiple";
  required: boolean;
  form?: FormInstance<any>;
  layout: "VERTICAL" | "HORIZONTAL";
  // validate: {
  //   required:
  // };
}

const WrapFormItem = (
  {
    type,
    options,
    placeholder,
    label,
    name,
    value,
    rules,
    mode,
    required,
    form,
    layout,
    ...rest
  }: StructFormItem,
  ref
) => {
  const [valueData, setvalueData] = useState<string>();
  let component = null;
  switch (type) {
    case "TEXT":
      component = <Input ref={ref} {...rest} placeholder={placeholder} />;
      break;
    case "LONG_TEXT":
      component = (
        <Input.TextArea ref={ref} {...rest} placeholder={placeholder} />
      );
      break;
    case "NUMBER":
      component = <InputNumber ref={ref} {...rest} placeholder={placeholder} />;
      break;
    case "CHECKBOX":
      // let plainOptions;
      // if (options && !options?.[0]?.name) {
      //   plainOptions = options?.map((e) => {
      //     return { value: e, label: e };
      //   });
      // }else{
      //   plainOptions = options?.map((e) => {
      //     return { value: e?.value, label: e?.name };
      //   });
      // }
      let plainOptions = options?.map((e) => {
        return { value: e?.value, label: e?.name || e?.label };
      });

      component = (
        <Checkbox.Group
          style={
            layout === "VERTICAL"
              ? {
                  display: "flex",
                  flexDirection: "column",
                }
              : {}
          }
          className="vertical-layout"
          ref={ref}
          options={plainOptions}
        />
      );
      break;
    case "RADIO":
      component = (
        <Radio.Group
          style={
            layout === "VERTICAL"
              ? {
                  display: "flex",
                  flexDirection: "column",
                }
              : {}
          }
          className="vertical-layout"
          ref={ref}
          {...rest}
        >
          {options?.map((e, i) => {
            return (
              <Radio {...rest} key={i} value={e?.value}>
                {e?.label || e?.name}
              </Radio>
            );
          })}
        </Radio.Group>
      );
      break;
    case "DATE":
      component = <DatePicker ref={ref} {...rest} format={"DD/MM/YYYY"} />;
      break;
    case "DATE_TIME":
      component = (
        <DatePicker ref={ref} format="YYYY-MM-DD HH:mm:ss" showTime {...rest} />
      );
      break;
    case "LIST":
      component = (
        <Select
          {...(mode ? { mode } : {})}
          ref={ref}
          dropdownStyle={{ zIndex: 20000 }}
          {...rest}
          placeholder={placeholder}
        >
          {options?.map((e, i) => {
            return (
              // <Option {...rest} key={i} value={e?.value}>
              //   {e?.name}
              // </Option>
              <Option {...rest} key={i} value={e?.value || e}>
                {e?.label || e}
              </Option>
            );
          })}
        </Select>
      );
      break;
    case "IMAGE":
      component = (
        <SingleImageUpload
          rules={[
            {
              required: required,
              message: "Vui lòng trả lời câu hỏi này",
            },
          ]}
          {...rest}
          name={`${name}`}
          label={label}
        />
      );
      break;
    case "single-checkbox":
      component = <Checkbox ref={ref} {...rest}></Checkbox>;
      break;
    case "SWITCH":
      component = <Switch ref={ref} {...rest} />;

      break;
    case "RATE":
      component = <Rate ref={ref} {...rest} />;

      break;
    default:
      break;
  }
  // return (
  //   <Form.Item rules={[]} name={name} label={label}>
  //     {component}
  //   </Form.Item>
  // );

  return type !== "IMAGE" ? (
    <div>
      <Form.Item
        //ts-ignore
        normalize={(value) => {
          setvalueData(value);
          return value;
        }}
        dependencies={[name + "-other"]}
        rules={
          rules || [
            {
              required: required,
              message: "Vui lòng trả lời câu hỏi này",
            },
            () => ({
              validator(_, value) {
                setvalueData(value);

                return Promise.resolve();
              },
            }),
            // {
            //   validator(rule, value, callback) {
            //     setvalueData(value);
            //     return true;
            //   },
            // },
          ]
        }
        name={name}
        label={label}
        valuePropName={
          type === "single-checkbox" || type === "SWITCH"
            ? "checked"
            : undefined
        }
      >
        {component}
      </Form.Item>
      {valueData?.toString() === "0" && (
        <Form.Item name={name + "-other"}>
          <Input.TextArea />
        </Form.Item>
      )}
    </div>
  ) : (
    component
  );
};

export default React.memo(React.forwardRef(WrapFormItem));
