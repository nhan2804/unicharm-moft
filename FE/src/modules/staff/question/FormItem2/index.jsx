import WrapFormItem from "@components/WrapFormItem";
import { listTypeValue } from "@modules/manager/questions/components/Form";
import classNames from "classnames";
import React, { memo } from "react";
const shuffle = (arr) => {
  if (!arr?.length) return [];
  return arr
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

const FormItem2 = ({
  form,
  question,
  isShuffle,
  nestedName,
  classNameLabel,
}) => {
  const { type, kind, required, _id, name, option } = question || {};

  const multiple = type === "MULTI" ? "multiple" : "";
  let typeCompo = listTypeValue?.[type]?.find(
    (i) => kind === i?.value
  )?.formItem;
  if (!typeCompo && type === "UPLOAD") {
    typeCompo = "IMAGE";
  }
  return (
    <div
    //   className={classNames(
    //     group?.type === "HORIZONTAL" && "flex space-x-2 overflow-auto"
    //   )}
    >
      <WrapFormItem
        // layout={e?.layout || group?.layout}
        form={form}
        required={required}
        key={_id}
        mode={multiple}
        options={!isShuffle ? option : shuffle(option)}
        name={nestedName ? nestedName?.concat([_id]) : _id}
        type={typeCompo}
        label={
          <span className={(classNames("font-bold"), classNameLabel)}>
            {name}
          </span>
        }
      />
    </div>
  );
};

export default memo(FormItem2);
